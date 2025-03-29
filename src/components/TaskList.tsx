
import { useState } from "react";
import { 
  ArrowDownAZ, 
  ArrowDownZA, 
  ArrowDownUp, 
  Calendar as CalendarIcon,
  CheckCircle2, 
  ChevronDown, 
  ClipboardList, 
  Filter, 
  Search 
} from "lucide-react";
import { format, isBefore, isToday, startOfDay } from "date-fns";

import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/TaskCard";
import { Priority, Task, useTaskContext } from "@/contexts/TaskContext";

type SortOption = 'dueDate' | 'priority' | 'title' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type FilterOption = 'all' | 'completed' | 'active' | 'overdue' | 'today';

interface TaskListProps {
  tasks: Task[];
  title?: string;
  onTaskClick?: (task: Task) => void;
  initialSort?: SortOption;
  initialDirection?: SortDirection;
  initialFilter?: FilterOption;
  showFilter?: boolean;
  showSearch?: boolean;
  emptyMessage?: string;
}

const TaskList = ({
  tasks,
  title = "Tasks",
  onTaskClick,
  initialSort = 'dueDate',
  initialDirection = 'asc',
  initialFilter = 'all',
  showFilter = true,
  showSearch = true,
  emptyMessage = "No tasks found"
}: TaskListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);
  const [filter, setFilter] = useState<FilterOption>(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  
  const today = new Date();
  const startOfToday = startOfDay(today);

  // Filter tasks based on filter option and search query
  const filteredTasks = tasks.filter(task => {
    // First apply the selected filter
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'active' && task.completed) return false;
    if (filter === 'overdue') {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return isBefore(dueDate, startOfToday) && !isToday(dueDate);
    }
    if (filter === 'today') {
      if (!task.dueDate) return false;
      return isToday(new Date(task.dueDate));
    }
    
    // Then apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Sort tasks based on sort option and direction
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'dueDate') {
      // Handle null due dates by putting them at the end
      if (!a.dueDate && !b.dueDate) comparison = 0;
      else if (!a.dueDate) comparison = 1;
      else if (!b.dueDate) comparison = -1;
      else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } 
    else if (sortBy === 'priority') {
      const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
      comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    }
    else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Toggle sort direction when clicking on the same sort option
  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  // Render the icon for the sort button
  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return <ArrowDownUp className="h-4 w-4" />;
    return sortDirection === 'asc' 
      ? <ArrowDownAZ className="h-4 w-4" /> 
      : <ArrowDownZA className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <Badge variant="outline" className="ml-2">
            {filteredTasks.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {showSearch && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          {showFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    <span>All Tasks</span>
                    {filter === 'all' && <CheckCircle2 className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('active')}>
                    <span className="mr-2">🔵</span>
                    <span>Active</span>
                    {filter === 'active' && <CheckCircle2 className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('completed')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Completed</span>
                    {filter === 'completed' && <CheckCircle2 className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('today')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Due Today</span>
                    {filter === 'today' && <CheckCircle2 className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('overdue')}>
                    <span className="mr-2">🔴</span>
                    <span>Overdue</span>
                    {filter === 'overdue' && <CheckCircle2 className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleSort('dueDate')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Due Date</span>
                    {sortBy === 'dueDate' && (
                      sortDirection === 'asc' 
                        ? <ArrowDownAZ className="ml-auto h-4 w-4" />
                        : <ArrowDownZA className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('priority')}>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    <span>Priority</span>
                    {sortBy === 'priority' && (
                      sortDirection === 'asc' 
                        ? <ArrowDownAZ className="ml-auto h-4 w-4" />
                        : <ArrowDownZA className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('title')}>
                    <span className="mr-2">Aa</span>
                    <span>Title</span>
                    {sortBy === 'title' && (
                      sortDirection === 'asc' 
                        ? <ArrowDownAZ className="ml-auto h-4 w-4" />
                        : <ArrowDownZA className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('createdAt')}>
                    <span className="mr-2">📅</span>
                    <span>Date Created</span>
                    {sortBy === 'createdAt' && (
                      sortDirection === 'asc' 
                        ? <ArrowDownAZ className="ml-auto h-4 w-4" />
                        : <ArrowDownZA className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {sortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={() => onTaskClick && onTaskClick(task)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{emptyMessage}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {searchQuery ? "Try a different search term or filter" : "Create a new task to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
