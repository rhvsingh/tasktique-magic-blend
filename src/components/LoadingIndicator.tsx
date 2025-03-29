
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingIndicatorProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const LoadingIndicator = ({ 
  className, 
  size = "md", 
  fullScreen = false 
}: LoadingIndicatorProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-2">
          <Loader 
            className={cn("animate-spin text-taskique-purple", sizeClasses[size], className)} 
          />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Loader 
      className={cn("animate-spin text-taskique-purple", sizeClasses[size], className)} 
    />
  );
};

export default LoadingIndicator;
