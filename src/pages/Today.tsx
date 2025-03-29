
import { useState } from "react";
import { Plus } from "lucide-react";
import { isToday, parseISO } from "date-fns";

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

const Today = () => {
  const { tasks, addTask, updateTask } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Get tasks due today
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isToday(parseISO(task.dueDate));
  });
  
  // Handle adding a new task
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    // Set due date to today if not specified
    if (!taskData.dueDate) {
      taskData.dueDate = new Date().toISOString();
    }
    
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
          <h1 className="text-3xl font-bold tracking-tight">Today's Tasks</h1>
          <p className="text-muted-foreground">
            Focus on what you need to accomplish today.
          </p>
        </div>
        <Button 
          onClick={() => setIsAddTaskOpen(true)}
          className="bg-taskique-purple hover:bg-taskique-deep-purple"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task for Today
        </Button>
      </div>

      <TaskList
        tasks={todayTasks}
        title="Due Today"
        onTaskClick={handleTaskClick}
        showFilter={true}
        initialFilter="all"
        initialSort="priority"
        emptyMessage="No tasks due today"
      />

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Task for Today</DialogTitle>
          </DialogHeader>
          <TaskForm 
            initialData={{ dueDate: new Date().toISOString() }}
            onSubmit={handleAddTask} 
            onCancel={() => setIsAddTaskOpen(false)} 
          />
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

export default Today;
