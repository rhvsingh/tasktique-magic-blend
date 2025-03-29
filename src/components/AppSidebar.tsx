
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  CheckSquare,
  Menu,
  MoonStar,
  MoreVertical,
  Plus,
  Settings,
  SunMedium,
  LayoutDashboard,
  ListTodo,
  BrainCircuit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskForm from "@/components/TaskForm";
import { Task } from "@/contexts/TaskContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getStoredTheme, setTheme, Theme } from "@/lib/theme-manager";

export function AppSidebar() {
  const location = useLocation();
  const { tasks, stats, addTask } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { open, setOpen } = useSidebar();

  // Check if current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle adding a new task
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(taskData);
    setIsAddTaskOpen(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const currentTheme = getStoredTheme();
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  // Load theme state on component mount
  useEffect(() => {
    const theme = getStoredTheme();
    setIsDarkMode(theme === 'dark');
  }, []);

  // Stats counts
  const todayCount = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const upcomingCount = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const dueDate = new Date(task.dueDate);
    return dueDate > today;
  }).length;

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="size-8 bg-gradient-to-br from-taskique-purple to-taskique-deep-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <h1 className="text-xl font-bold ml-2">TaskTique</h1>
          </div>
          <div className="flex items-center">
            <SidebarTrigger />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDarkMode ? (
                    <>
                      <SunMedium className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonStar className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarHeader>

        <Button
          className="mx-4 bg-taskique-purple hover:bg-taskique-deep-purple"
          onClick={() => setIsAddTaskOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>

        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/")}
                tooltip="Dashboard"
              >
                <Link to="/">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/tasks")}
                tooltip="All Tasks"
              >
                <Link to="/tasks">
                  <ListTodo className="h-4 w-4 mr-2" />
                  <span>All Tasks</span>
                  {stats.totalTasks > 0 && (
                    <span className="ml-auto bg-muted text-muted-foreground text-xs rounded-full px-2">
                      {stats.totalTasks}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/ai-prompts")}
                tooltip="AI Prompts"
              >
                <Link to="/ai-prompts">
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  <span>AI Prompts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/today")}
                tooltip="Today"
              >
                <Link to="/today">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>Today</span>
                  {todayCount > 0 && (
                    <span className="ml-auto bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs rounded-full px-2">
                      {todayCount}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/upcoming")}
                tooltip="Upcoming"
              >
                <Link to="/upcoming">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>Upcoming</span>
                  {upcomingCount > 0 && (
                    <span className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full px-2">
                      {upcomingCount}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/completed")}
                tooltip="Completed"
              >
                <Link to="/completed">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  <span>Completed</span>
                  {completedCount > 0 && (
                    <span className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full px-2">
                      {completedCount}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Separator className="my-4" />

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/settings")}
                tooltip="Settings"
              >
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">U</span>
              </div>
              <span className="ml-2 text-sm font-medium">User</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <SunMedium className="h-4 w-4" />
              ) : (
                <MoonStar className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddTaskOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Sidebar opener for mobile when sidebar is closed */}
      {!open && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-4 right-4 z-10 md:hidden rounded-full w-12 h-12 shadow-md bg-background"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
