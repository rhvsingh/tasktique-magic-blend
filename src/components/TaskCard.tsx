
import { Calendar, Clock, Tag } from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Task, useTaskContext, Priority } from "@/contexts/TaskContext";

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const priorityClasses = {
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  };

  return (
    <Badge variant="outline" className={cn("capitalize", priorityClasses[priority])}>
      {priority}
    </Badge>
  );
};

const DueDateBadge = ({ dueDate }: { dueDate: string | null }) => {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const isOverdue = isPast(date) && !isToday(date);
  
  let displayText = '';
  let className = '';

  if (isToday(date)) {
    displayText = 'Today';
    className = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  } else if (isTomorrow(date)) {
    displayText = 'Tomorrow';
    className = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
  } else if (isOverdue) {
    displayText = 'Overdue';
    className = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  } else {
    displayText = format(date, 'MMM d');
    className = 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300';
  }

  return (
    <Badge variant="outline" className={cn(className)}>
      <Calendar className="mr-1 h-3 w-3" />
      {displayText}
    </Badge>
  );
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { completeTask, tags: allTags } = useTaskContext();

  // Get the tags that are associated with this task
  const taskTags = allTags.filter(tag => task.tags.includes(tag.id));

  // Format the created date
  const createdDate = new Date(task.createdAt);
  const formattedDate = format(createdDate, 'MMM d, yyyy');

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    completeTask(task.id);
  };

  return (
    <Card 
      className={cn(
        "card-hover cursor-pointer overflow-hidden border-l-4",
        task.completed ? "border-l-gray-400" : `border-l-taskique-purple`
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox 
            checked={task.completed} 
            onClick={handleComplete}
            className="mt-1"
          />
          <div className="space-y-1 flex-1">
            <h3 className={cn("font-medium", task.completed && "task-complete")}>
              {task.title}
            </h3>
            {task.description && (
              <p className={cn("text-sm text-muted-foreground line-clamp-2", task.completed && "task-complete")}>
                {task.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2 p-4 pt-0">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <DueDateBadge dueDate={task.dueDate} />
          )}
          <PriorityBadge priority={task.priority} />
        </div>
        
        <div className="flex items-center gap-1 ml-auto">
          {taskTags.map(tag => (
            <Badge 
              key={tag.id} 
              variant="outline" 
              className="flex items-center"
              style={{ 
                backgroundColor: `${tag.color}20`, // 20% opacity
                borderColor: tag.color,
                color: tag.color 
              }}
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
