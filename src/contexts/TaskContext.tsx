
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ApiTask, fetchTasks, createTask, updateTask, deleteTask, processAiTasks } from '@/lib/api';

export type Priority = 'low' | 'medium' | 'high';
export type EstimationType = 'minutes' | 'hours' | 'days';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
  priority: Priority;
  estimationType: EstimationType;
  estimationValue: number | null;
  tags: string[];
}

export interface TaskStats {
  totalTasks: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  totalEstimatedTime: string;
  totalEstimatedHours: number;
}

interface TaskContextProps {
  tasks: Task[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  stats: TaskStats;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => Promise<void>;
  updateTask: (id: string, updatedTask: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  deleteTag: (id: string) => void;
  refreshTasks: () => Promise<void>;
  processAiPrompt: (promptText: string) => Promise<void>;
}

const defaultTags: Tag[] = [
  { id: '1', name: 'Work', color: '#9b87f5' },
  { id: '2', name: 'Personal', color: '#F97316' },
  { id: '3', name: 'Study', color: '#0EA5E9' },
];

const defaultStats: TaskStats = {
  totalTasks: 0,
  highPriorityCount: 0,
  mediumPriorityCount: 0,
  lowPriorityCount: 0,
  totalEstimatedTime: "0 minutes",
  totalEstimatedHours: 0
};

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Helper function to convert API tasks to our app's task format
const mapApiTaskToTask = (apiTask: ApiTask): Task => ({
  id: apiTask._id || Math.random().toString(36).substring(2, 9),
  title: apiTask.title,
  description: apiTask.description,
  completed: apiTask.completed || false,
  createdAt: apiTask.created_at || new Date().toISOString(),
  dueDate: apiTask.due_date,
  priority: apiTask.priority,
  estimationType: apiTask.estimation_type || 'hours',
  estimationValue: apiTask.estimation_value || 0,
  tags: [],
});

// Helper function to convert our app's task format to API task format
const mapTaskToApiTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>): Omit<ApiTask, '_id'> => ({
  title: task.title,
  description: task.description,
  priority: task.priority,
  due_date: task.dueDate,
  estimation_type: task.estimationType,
  estimation_value: task.estimationValue,
  created_at: null,
  updated_at: null,
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>(() => {
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : defaultTags;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TaskStats>(defaultStats);

  // Load tasks from API when component mounts
  useEffect(() => {
    refreshTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  // Function to refresh tasks from API
  const refreshTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTasks();
      
      const mappedTasks = response.tasks.map(mapApiTaskToTask);
      setTasks(mappedTasks);
      
      // Update stats if metadata is available
      if (response.metadata) {
        setStats({
          totalTasks: response.metadata.total_tasks,
          highPriorityCount: response.metadata.high_priority_count,
          mediumPriorityCount: response.metadata.medium_priority_count,
          lowPriorityCount: response.metadata.low_priority_count,
          totalEstimatedTime: response.metadata.total_estimated_time,
          totalEstimatedHours: response.metadata.total_estimated_hours
        });
      } else {
        // Calculate stats from tasks
        updateStatsFromTasks(mappedTasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from tasks
  const updateStatsFromTasks = (currentTasks: Task[]) => {
    const highPriorityTasks = currentTasks.filter(task => task.priority === 'high');
    const mediumPriorityTasks = currentTasks.filter(task => task.priority === 'medium');
    const lowPriorityTasks = currentTasks.filter(task => task.priority === 'low');
    
    let totalHours = 0;
    currentTasks.forEach(task => {
      if (task.estimationValue) {
        switch (task.estimationType) {
          case 'minutes':
            totalHours += (task.estimationValue / 60);
            break;
          case 'hours':
            totalHours += task.estimationValue;
            break;
          case 'days':
            totalHours += (task.estimationValue * 8); // Assuming 8 hours per day
            break;
        }
      }
    });
    
    setStats({
      totalTasks: currentTasks.length,
      highPriorityCount: highPriorityTasks.length,
      mediumPriorityCount: mediumPriorityTasks.length,
      lowPriorityCount: lowPriorityTasks.length,
      totalEstimatedTime: `${totalHours} hours`,
      totalEstimatedHours: totalHours
    });
  };

  // Add a new task
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    try {
      const apiTask = mapTaskToApiTask(task);
      const response = await createTask(apiTask);
      
      const newTask = mapApiTaskToTask(response.task);
      setTasks(prev => [...prev, newTask]);
      
      // Update stats
      updateStatsFromTasks([...tasks, newTask]);
      
      toast.success('Task added successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  // Update an existing task
  const updateTask = async (id: string, updatedTaskData: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      // Map our app's task data to API format
      const apiTaskData: Partial<ApiTask> = {};
      
      if (updatedTaskData.title !== undefined) apiTaskData.title = updatedTaskData.title;
      if (updatedTaskData.description !== undefined) apiTaskData.description = updatedTaskData.description;
      if (updatedTaskData.priority !== undefined) apiTaskData.priority = updatedTaskData.priority;
      if (updatedTaskData.dueDate !== undefined) apiTaskData.due_date = updatedTaskData.dueDate;
      if (updatedTaskData.estimationType !== undefined) apiTaskData.estimation_type = updatedTaskData.estimationType;
      if (updatedTaskData.estimationValue !== undefined) apiTaskData.estimation_value = updatedTaskData.estimationValue;
      if (updatedTaskData.completed !== undefined) apiTaskData.completed = updatedTaskData.completed;
      
      await updateTask(id, apiTaskData);
      
      // Update the local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, ...updatedTaskData } : task
        )
      );
      
      // Update stats
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, ...updatedTaskData } : task
      );
      updateStatsFromTasks(updatedTasks);
      
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      
      // Update the local state
      setTasks(prev => prev.filter(task => task.id !== id));
      
      // Update stats
      const updatedTasks = tasks.filter(task => task.id !== id);
      updateStatsFromTasks(updatedTasks);
      
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  // Toggle task completion status
  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newCompletedStatus = !task.completed;
    
    try {
      await updateTask(id, { completed: newCompletedStatus });
      
      // Update the local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, completed: newCompletedStatus } : task
        )
      );
      
      toast.success(`Task marked as ${newCompletedStatus ? 'completed' : 'active'}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  // Process AI prompt
  const processAiPrompt = async (promptText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await processAiTasks(promptText);
      
      // Map API tasks to our app's task format
      const aiTasks = response.tasks.map(mapApiTaskToTask);
      
      // Update local state with new tasks
      setTasks(prev => [...prev, ...aiTasks]);
      
      // Update stats
      if (response.metadata) {
        setStats({
          totalTasks: response.metadata.total_tasks,
          highPriorityCount: response.metadata.high_priority_count,
          mediumPriorityCount: response.metadata.medium_priority_count,
          lowPriorityCount: response.metadata.low_priority_count,
          totalEstimatedTime: response.metadata.total_estimated_time,
          totalEstimatedHours: response.metadata.total_estimated_hours
        });
      } else {
        updateStatsFromTasks([...tasks, ...aiTasks]);
      }
      
      toast.success('AI tasks processed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing AI tasks');
      toast.error(err instanceof Error ? err.message : 'Failed to process AI tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a tag
  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    setTags((prevTags) => [...prevTags, newTag]);
    toast.success('Tag created successfully');
  };

  // Delete a tag
  const deleteTag = (id: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
    
    // Remove the tag from all tasks that have it
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        tags: task.tags.filter((tagId) => tagId !== id),
      }))
    );
    
    toast.success('Tag deleted');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        tags,
        isLoading,
        error,
        stats,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        addTag,
        deleteTag,
        refreshTasks,
        processAiPrompt,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
