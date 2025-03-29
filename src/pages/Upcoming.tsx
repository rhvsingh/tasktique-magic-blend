
import { useState } from "react";
import { Plus } from "lucide-react";
import { isAfter, isBefore, isToday, parseISO, startOfDay, addDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { Task, useTaskContext } from "@/contexts/TaskContext";

const Upcoming = () => {
  const { tasks, addTask, updateTask } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  
  // Get tasks for tomorrow
  const tomorrowTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    
    const dueDate = startOfDay(parseISO(task.dueDate));
    return isBefore(today, dueDate) && 
           format(dueDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
  });
  
  // Get tasks for the next 7 days (excluding tomorrow)
  const nextWeekTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    
    const dueDate = startOfDay(parseISO(task.dueDate));
    return isAfter(dueDate, tomorrow) && 
           isBefore(dueDate, nextWeek);
  });
  
  // Get tasks due later (beyond next week)
  const laterTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    
    const dueDate = startOfDay(parseISO(task.dueDate));
    return isAfter(dueDate, nextWeek);
  });
  
  // Handle adding a new task
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Tasks</h1>
          <p className="text-muted-foreground">
            Plan ahead and stay organized with your upcoming tasks.
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

      <Tabs defaultValue="tomorrow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="week">Next 7 Days</TabsTrigger>
          <TabsTrigger value="later">Later</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tomorrow" className="mt-6">
          <TaskList
            tasks={tomorrowTasks}
            title={`Tomorrow (${format(tomorrow, 'MMM d')})`}
            onTaskClick={handleTaskClick}
            initialSort="priority"
            initialFilter="all"
            emptyMessage="No tasks scheduled for tomorrow"
          />
        </TabsContent>
        
        <TabsContent value="week" className="mt-6">
          <TaskList
            tasks={nextWeekTasks}
            title="Next 7 Days"
            onTaskClick={handleTaskClick}
            initialSort="dueDate"
            initialFilter="all"
            emptyMessage="No tasks scheduled for the upcoming week"
          />
        </TabsContent>
        
        <TabsContent value="later" className="mt-6">
          <TaskList
            tasks={laterTasks}
            title="Future Tasks"
            onTaskClick={handleTaskClick}
            initialSort="dueDate"
            initialFilter="all"
            emptyMessage="No tasks scheduled for the future"
          />
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            initialData={{ dueDate: tomorrow.toISOString() }}
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

export default Upcoming;
