
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Home,
  ListChecks,
  Plus,
  Settings,
  SparkleIcon,
  Menu,
  X,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { useTaskContext, Task } from "@/contexts/TaskContext";
import TaskForm from "@/components/TaskForm";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getStoredTheme, setTheme, Theme } from "@/lib/theme-manager";

export const AppSidebar = () => {
  const { tasks, stats } = useTaskContext();
  const location = useLocation();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { state, toggleSidebar } = useSidebar();
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');

  useEffect(() => {
    setCurrentTheme(getStoredTheme());
  }, []);

  const handleThemeToggle = () => {
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "All Tasks", icon: ListChecks, path: "/tasks", badge: stats.pendingCount },
    { label: "Today", icon: Calendar, path: "/today", badge: stats.todayCount },
    { label: "Upcoming", icon: Calendar, path: "/upcoming", badge: stats.upcomingCount },
    {
      label: "Completed",
      icon: CheckCircle2,
      path: "/completed",
      badge: stats.completedCount,
    },
    { label: "AI Prompts", icon: SparkleIcon, path: "/ai-prompts" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const { addTask } = useTaskContext();

  const handleAddTask = async (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    await addTask(taskData);
    setIsAddTaskOpen(false);
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between">
          <div className="flex items-center px-2">
            <span className="text-xl font-bold text-taskique-purple">TaskTique</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </SidebarHeader>
        <SidebarRail />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.path === location.pathname}
                      tooltip={item.label}
                    >
                      <NavLink to={item.path} className="w-full">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto rounded-full bg-taskique-purple/20 px-2 text-xs">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Dark Mode Toggle */}
          <SidebarGroup>
            <SidebarGroupLabel>Appearance</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2">
                <Toggle 
                  variant="outline" 
                  className="w-full justify-start"
                  pressed={currentTheme === 'dark'}
                  onPressedChange={handleThemeToggle}
                >
                  {currentTheme === 'dark' ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  )}
                </Toggle>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button
            className="w-full bg-taskique-purple hover:bg-taskique-deep-purple"
            onClick={() => setIsAddTaskOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Toggle Button for Collapsed Sidebar - Moved to right side */}
      {state === "collapsed" && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed right-2 top-4 z-50 md:flex hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddTaskOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
