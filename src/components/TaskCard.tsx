
import React from "react";
import { format, isAfter, isBefore, isToday, parseISO } from "date-fns";
import { CheckCircle2, Clock, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Task, useTaskContext } from "@/contexts/TaskContext";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { completeTask, deleteTask } = useTaskContext();

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      completeTask(task.id);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      deleteTask(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Function to render the due date status
  const renderDueDate = () => {
    if (!task.dueDate) return null;

    const dueDate = parseISO(task.dueDate);
    const today = new Date();
    let statusClass = "";
    let statusText = format(dueDate, "MMM d");

    if (isToday(dueDate)) {
      statusClass = "text-amber-600 dark:text-amber-400";
      statusText = "Today";
    } else if (isBefore(dueDate, today)) {
      statusClass = "text-red-600 dark:text-red-400";
      statusText = `Overdue: ${statusText}`;
    } else if (
      isAfter(dueDate, today) &&
      isBefore(dueDate, new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000))
    ) {
      statusClass = "text-amber-600 dark:text-amber-400";
      statusText = `Soon: ${statusText}`;
    }

    return (
      <div className={`flex items-center text-xs ${statusClass}`}>
        <Clock className="mr-1 h-3 w-3" />
        {statusText}
      </div>
    );
  };

  // Function to render priority badge
  const renderPriorityBadge = () => {
    const priorityClass = `priority-${task.priority}`;
    return <Badge className={`${priorityClass} capitalize`}>{task.priority}</Badge>;
  };

  const renderEstimation = () => {
    if (task.estimationValue === null) return null;

    return (
      <div className="text-xs text-muted-foreground">
        Est: {task.estimationValue} {task.estimationType}
      </div>
    );
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className={`card-hover border-l-4 ${
            task.completed ? "border-l-green-500 bg-green-50/30 dark:bg-green-950/10" : 
            task.priority === "high" ? "border-l-red-500" :
            task.priority === "medium" ? "border-l-amber-500" :
            "border-l-green-500"
          }`}
          onClick={onClick}
        >
          <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start space-y-0">
            <div className="space-y-1">
              <h3 className={`font-medium leading-tight ${task.completed ? "task-complete" : ""}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                {renderPriorityBadge()}
                {renderDueDate()}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onClick}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleComplete}>
                  {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          
          {task.description && (
            <CardContent className="p-4 pt-0 pb-2">
              <p className={`text-sm text-muted-foreground ${task.completed ? "task-complete" : ""}`}>
                {task.description}
              </p>
            </CardContent>
          )}
          
          <CardFooter className="p-4 pt-2 flex justify-between items-center">
            {renderEstimation()}
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${
                task.completed ? "text-green-600 bg-green-100 dark:bg-green-900/20" : ""
              }`}
              onClick={handleComplete}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="sr-only">
                {task.completed ? "Mark as incomplete" : "Mark as complete"}
              </span>
            </Button>
          </CardFooter>
        </Card>
      </ContextMenuTrigger>
      
      <ContextMenuContent>
        <ContextMenuItem onClick={onClick}>Edit</ContextMenuItem>
        <ContextMenuItem onClick={handleComplete}>
          {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TaskCard;
