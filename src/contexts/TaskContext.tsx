
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type Priority = 'low' | 'medium' | 'high';

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
  tags: string[];
}

interface TaskContextProps {
  tasks: Task[];
  tags: Tag[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updatedTask: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  deleteTag: (id: string) => void;
}

const defaultTags: Tag[] = [
  { id: '1', name: 'Work', color: '#9b87f5' },
  { id: '2', name: 'Personal', color: '#F97316' },
  { id: '3', name: 'Study', color: '#0EA5E9' },
];

// Sample tasks
const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the proposal for the new client project',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: 'high',
    tags: ['1'],
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Get milk, eggs, bread, and vegetables',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    priority: 'medium',
    tags: ['2'],
  },
  {
    id: '3',
    title: 'Study for exam',
    description: 'Review chapters 5-8 for upcoming test',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    priority: 'high',
    tags: ['3'],
  },
  {
    id: '4',
    title: 'Go for a run',
    description: 'Morning jog in the park',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    dueDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    priority: 'low',
    tags: ['2'],
  },
];

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  });
  
  const [tags, setTags] = useState<Tag[]>(() => {
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : defaultTags;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast.success('Task added successfully');
  };

  const updateTask = (id: string, updatedTask: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
    toast.success('Task updated successfully');
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast.success('Task deleted');
  };

  const completeTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success('Task status updated');
  };

  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    setTags((prevTags) => [...prevTags, newTag]);
    toast.success('Tag created successfully');
  };

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
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        addTag,
        deleteTag,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
