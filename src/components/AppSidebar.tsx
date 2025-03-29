
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTaskContext } from "@/contexts/TaskContext";
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

// Type for menu items
interface MenuItem {
  label: string;
  icon: typeof Home;
  path: string;
  badge?: number;
}

export const AppSidebar = () => {
  const { tasks } = useTaskContext();
  const location = useLocation();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { state, toggleSidebar } = useSidebar();

  const menuItems: MenuItem[] = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "All Tasks", icon: ListChecks, path: "/tasks", badge: tasks.length },
    { label: "Today", icon: Calendar, path: "/today" },
    { label: "Upcoming", icon: Calendar, path: "/upcoming" },
    {
      label: "Completed",
      icon: CheckCircle2,
      path: "/completed",
      badge: tasks.filter((task) => task.completed).length,
    },
    { label: "AI Prompts", icon: SparkleIcon, path: "/ai-prompts" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const { addTask } = useTaskContext();

  const handleAddTask = async (taskData: Omit<any, "id" | "createdAt">) => {
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
                        {item.badge !== undefined && (
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

      {/* Toggle Button for Collapsed Sidebar */}
      {state === "collapsed" && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed left-2 top-4 z-50 md:flex hidden"
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
