
import { 
  CalendarDays, 
  CheckCircle2, 
  Home, 
  ListTodo, 
  Plus, 
  Tag,
  Clock,
  SunMoon
} from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskContext, Tag as TagType } from "@/contexts/TaskContext";

// Navigation items for the sidebar
const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "All Tasks",
    icon: ListTodo,
    path: "/tasks",
  },
  {
    title: "Today",
    icon: Clock,
    path: "/today",
  },
  {
    title: "Upcoming",
    icon: CalendarDays,
    path: "/upcoming",
  },
  {
    title: "Completed",
    icon: CheckCircle2,
    path: "/completed",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { tags, tasks } = useTaskContext();

  // Count uncompleted tasks for each tag
  const getTagTaskCount = (tagId: string) => {
    return tasks.filter(task => !task.completed && task.tags.includes(tagId)).length;
  };

  // Count today's tasks
  const getTodayTaskCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate.getTime() === today.getTime();
    }).length;
  };

  // Count upcoming tasks (due after today)
  const getUpcomingTaskCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate.getTime() > today.getTime();
    }).length;
  };

  // Count completed tasks
  const getCompletedTaskCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  // Count all uncompleted tasks
  const getAllTasksCount = () => {
    return tasks.filter(task => !task.completed).length;
  };

  const getCountForNavItem = (path: string) => {
    switch (path) {
      case "/tasks":
        return getAllTasksCount();
      case "/today":
        return getTodayTaskCount();
      case "/upcoming":
        return getUpcomingTaskCount();
      case "/completed":
        return getCompletedTaskCount();
      default:
        return 0;
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl text-taskique-purple">TaskTique</span>
        </div>
        <div className="ml-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <SidebarGroup>
            <SidebarGroupContent className="px-2">
              <Button 
                variant="default" 
                className="w-full justify-start mb-4 bg-taskique-purple hover:bg-taskique-deep-purple"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
              <SidebarMenu>
                {navItems.map((item) => {
                  const count = getCountForNavItem(item.path);
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild className={isActive ? 'bg-accent text-accent-foreground' : ''}>
                        <a href={item.path} className="flex justify-between items-center">
                          <span className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </span>
                          {count > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              {count}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4">
              <div className="flex items-center justify-between">
                <span>Tags</span>
                <Button size="icon" variant="ghost" className="h-5 w-5">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {tags.map((tag: TagType) => {
                  const count = getTagTaskCount(tag.id);
                  
                  return (
                    <SidebarMenuItem key={tag.id}>
                      <SidebarMenuButton asChild>
                        <a href={`/tags/${tag.id}`} className="flex justify-between items-center">
                          <span className="flex items-center">
                            <Tag className="mr-2 h-4 w-4" style={{ color: tag.color }} />
                            <span>{tag.name}</span>
                          </span>
                          {count > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              {count}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
