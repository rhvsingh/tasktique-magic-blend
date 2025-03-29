
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskProvider } from "@/contexts/TaskContext";
import { Outlet, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Tasks from "./Tasks";
import Today from "./Today";
import Upcoming from "./Upcoming";
import CompletedTasks from "./CompletedTasks";
import Settings from "./Settings";
import AiPrompts from "./AiPrompts";

// Layout component with sidebar
const Layout = () => {
  return (
    <SidebarProvider>
      <TaskProvider>
        <div className="w-full min-h-screen flex">
          <AppSidebar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </TaskProvider>
    </SidebarProvider>
  );
};

// Main App Component
const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="today" element={<Today />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="completed" element={<CompletedTasks />} />
        <Route path="ai-prompts" element={<AiPrompts />} />
        <Route path="settings" element={<Settings />} />
        {/* Redirect all other paths to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default Index;
