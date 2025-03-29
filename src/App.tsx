
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { initializeTheme } from "./lib/theme-manager";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
