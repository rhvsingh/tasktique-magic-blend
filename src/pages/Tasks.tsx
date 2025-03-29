
import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Task, useTaskContext } from "@/contexts/TaskContext";

const Tasks = () => {
  const { tasks, addTask, updateTask, isLoading } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Handle adding a new task
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    try {
      await addTask(taskData);
      setIsAddTaskOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle updating a task
  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handle clicking on a task
  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
          <p className="text-muted-foreground">
            View and manage all your tasks in one place.
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

      <TaskList
        tasks={tasks}
        title="All Tasks"
        onTaskClick={handleTaskClick}
        emptyMessage="No tasks available"
        filterStatus="pending"
      />

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddTaskOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm 
              initialData={editingTask}
              onSubmit={handleUpdateTask} 
              onCancel={() => setEditingTask(null)}
              submitText="Update Task"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Global loading indicator */}
      {isLoading && <LoadingIndicator fullScreen />}
    </div>
  );
};

export default Tasks;
