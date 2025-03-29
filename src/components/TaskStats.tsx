
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BellRing, 
  CalendarClock, 
  CheckCircle2, 
  Clock,
  ClipboardList
} from "lucide-react";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, parseISO, isBefore, isToday } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/contexts/TaskContext";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {trend && (
              <span className={cn(
                "mr-1 flex items-center", 
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend.isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  // Get total tasks
  const totalTasks = tasks.length;
  
  // Get completed tasks
  const completedTasks = tasks.filter(task => task.completed).length;
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Get tasks due today
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  
  const tasksToday = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDate = parseISO(task.dueDate);
    return dueDate >= startOfToday && dueDate <= endOfToday;
  });
  
  // Get tasks for this week
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
  
  const tasksThisWeek = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDate = parseISO(task.dueDate);
    return dueDate >= startOfThisWeek && dueDate <= endOfThisWeek;
  });

  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDate = parseISO(task.dueDate);
    return isBefore(dueDate, startOfToday) && !isToday(dueDate);
  });

  // Mock trend data - this would normally be calculated by comparing with previous period
  const mockCompletionTrend = { value: 12, isPositive: true };
  const mockTaskCreationTrend = { value: 5, isPositive: true };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Tasks"
        value={totalTasks}
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        trend={mockTaskCreationTrend}
        description="from last week"
      />
      <StatsCard
        title="Completion Rate"
        value={`${completionRate}%`}
        icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
        trend={mockCompletionTrend}
        description="from last week"
      />
      <StatsCard
        title="Due Today"
        value={tasksToday.length}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        description={format(today, 'MMM d, yyyy')}
      />
      <StatsCard
        title="Overdue Tasks"
        value={overdueTasks.length}
        icon={<BellRing className="h-4 w-4 text-muted-foreground" />}
        description="needs attention"
      />
    </div>
  );
};

export default TaskStats;
