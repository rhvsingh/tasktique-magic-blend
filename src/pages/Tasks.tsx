
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
import { Task, useTaskContext } from "@/contexts/TaskContext";

const Tasks = () => {
  const { tasks, addTask, updateTask } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Handle adding a new task
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(taskData);
    setIsAddTaskOpen(false);
  };

  // Handle updating a task
  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
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
    </div>
  );
};

export default Tasks;
