
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTaskContext } from "@/contexts/TaskContext";
import { getStoredTheme, setTheme, Theme } from "@/lib/theme-manager";

const Settings = () => {
  const { stats } = useTaskContext();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<boolean>(false);
  const [interfaceDensity, setInterfaceDensity] = useState<boolean>(false);
  const [showTaskProgress, setShowTaskProgress] = useState<boolean>(false);

  // Load settings from localStorage
  useEffect(() => {
    const theme = getStoredTheme();
    setDarkMode(theme === 'dark');
    
    // Load other settings
    setAnimationSpeed(localStorage.getItem('animation-speed') === 'fast');
    setInterfaceDensity(localStorage.getItem('interface-density') === 'compact');
    setShowTaskProgress(localStorage.getItem('show-task-progress') === 'true');
  }, []);

  // Handle dark mode toggle
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    const newTheme: Theme = checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Handle other setting toggles
  const handleAnimationSpeedToggle = (checked: boolean) => {
    setAnimationSpeed(checked);
    localStorage.setItem('animation-speed', checked ? 'fast' : 'normal');
  };

  const handleInterfaceDensityToggle = (checked: boolean) => {
    setInterfaceDensity(checked);
    localStorage.setItem('interface-density', checked ? 'compact' : 'comfortable');
  };

  const handleShowTaskProgressToggle = (checked: boolean) => {
    setShowTaskProgress(checked);
    localStorage.setItem('show-task-progress', checked.toString());
  };

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your TaskTique experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how TaskTique looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode.
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animation-speed">Fast Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Speed up transitions and animations.
                </p>
              </div>
              <Switch
                id="animation-speed"
                checked={animationSpeed}
                onCheckedChange={handleAnimationSpeedToggle}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="interface-density">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce padding and spacing to show more content.
                </p>
              </div>
              <Switch
                id="interface-density"
                checked={interfaceDensity}
                onCheckedChange={handleInterfaceDensityToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Display</CardTitle>
            <CardDescription>
              Configure how tasks are displayed and organized.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-progress">Show Task Progress Bars</Label>
                <p className="text-sm text-muted-foreground">
                  Display visual progress indicators on tasks.
                </p>
              </div>
              <Switch
                id="task-progress"
                checked={showTaskProgress}
                onCheckedChange={handleShowTaskProgressToggle}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Task Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Total Tasks</span>
                  <span className="font-medium">{stats.totalTasks}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Total Estimated Hours</span>
                  <span className="font-medium">{stats.totalEstimatedHours}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">High Priority</span>
                  <span className="font-medium text-red-600 dark:text-red-400">{stats.highPriorityCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Medium Priority</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">{stats.mediumPriorityCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About TaskTique</CardTitle>
          <CardDescription>
            Information about your TaskTique application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-medium">Version</h3>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">Created With</h3>
            <p className="text-sm text-muted-foreground">
              React, Tailwind CSS, and Shadcn UI
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium">UI Design</h3>
            <p className="text-sm text-muted-foreground">
              Neomorphism design principles with Tailwind CSS
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
