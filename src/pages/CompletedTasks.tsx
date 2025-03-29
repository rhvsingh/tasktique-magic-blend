
import { useState } from "react";
import { format, parseISO } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { Task, useTaskContext } from "@/contexts/TaskContext";

const CompletedTasks = () => {
  const { tasks, updateTask } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Completed Tasks</h1>
        <p className="text-muted-foreground">
          Review your accomplishments and completed tasks.
        </p>
      </div>

      <TaskList
        tasks={tasks}
        title="Completed"
        onTaskClick={handleTaskClick}
        initialSort="createdAt"
        initialDirection="desc"
        initialFilter="completed"
        emptyMessage="You haven't completed any tasks yet"
        filterStatus="completed"
      />

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{editingTask.title}</h2>
              {editingTask.description && (
                <p className="text-muted-foreground">{editingTask.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-medium block">Created:</span>
                  <span>{format(parseISO(editingTask.createdAt), 'PPP')}</span>
                </div>
                {editingTask.dueDate && (
                  <div>
                    <span className="font-medium block">Due:</span>
                    <span>{format(parseISO(editingTask.dueDate), 'PPP')}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium block">Priority:</span>
                  <span className="capitalize">{editingTask.priority}</span>
                </div>
              </div>
              <div className="pt-4">
                <TaskForm 
                  initialData={editingTask}
                  onSubmit={handleUpdateTask} 
                  onCancel={() => setEditingTask(null)}
                  submitText="Update Task"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompletedTasks;
