
import { useState } from "react";
import { Plus } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskStats from "@/components/TaskStats";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import AiPrompt from "@/components/AiPrompt";
import { Task, useTaskContext } from "@/contexts/TaskContext";

const Dashboard = () => {
  const { tasks, addTask } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Get tasks due today
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return isToday(parseISO(task.dueDate));
  });
  
  // Get recently created tasks (last 7 days)
  const recentTasks = tasks
    .filter(task => {
      const createdDate = new Date(task.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return createdDate >= sevenDaysAgo;
    })
    .slice(0, 5);

  // Handle adding a new task
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(taskData);
    setIsAddTaskOpen(false);
  };

  // Handle clicking on a task
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your tasks.
          </p>
        </div>
        <Button 
          onClick={() => setIsAddTaskOpen(true)}
          className="bg-taskique-purple hover:bg-taskique-deep-purple"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskStats tasks={tasks} />
      
      {/* AI Prompt Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">AI Task Assistant</h2>
        <AiPrompt />
      </div>

      <div className="space-y-6">
        <TaskList
          tasks={todayTasks}
          title="Due Today"
          onTaskClick={handleTaskClick}
          showFilter={false}
          emptyMessage="No tasks due today"
        />
        
        <TaskList
          tasks={recentTasks}
          title="Recently Added"
          onTaskClick={handleTaskClick}
          initialSort="createdAt"
          initialDirection="desc"
          showFilter={false}
          emptyMessage="No recent tasks"
        />
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddTaskOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* View/Edit Task Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskForm 
              initialData={selectedTask}
              onSubmit={(updatedTask) => {
                // Implementation handled by TaskProvider's updateTask method
                setSelectedTask(null);
              }} 
              onCancel={() => setSelectedTask(null)}
              submitText="Update Task"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
