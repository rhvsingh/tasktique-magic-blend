
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import TaskList from "@/components/TaskList";

const AiPrompts = () => {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { processAiPrompt, tasks, stats, isLoading } = useTaskContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    try {
      await processAiPrompt(prompt);
      setPrompt("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the most recent tasks (last 20)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Task Assistant</h1>
        <p className="text-muted-foreground">
          Let AI help you organize and create tasks from your project descriptions.
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-background to-slate-100/50 dark:from-background dark:to-slate-900/30 shadow-sm border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Enter Task Descriptions</h3>
            <p className="text-sm text-muted-foreground">
              Describe your tasks or project, and AI will organize them for you.
              Try using multiple lines for different tasks.
            </p>
          </div>

          <Textarea
            placeholder="Example:
Redesign the company website homepage.
Fix the payment gateway bug that's causing checkout failures.
Create monthly sales report for Q1.
Schedule team meeting to discuss product roadmap."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[200px] resize-none border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20"
            disabled={isSubmitting}
          />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              AI will generate tasks with titles, descriptions, priorities, and time estimates.
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !prompt.trim()}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <SendHorizontal className="h-4 w-4 mr-2" />
              {isSubmitting ? "Processing..." : "Process Tasks"}
            </Button>
          </div>
        </form>
      </Card>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{stats.totalTasks}</span>
            <span className="text-sm text-muted-foreground">Total Tasks</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center bg-red-50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30">
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.highPriorityCount}</span>
            <span className="text-sm text-muted-foreground">High Priority</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center bg-amber-50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30">
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.mediumPriorityCount}</span>
            <span className="text-sm text-muted-foreground">Medium Priority</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center bg-green-50 dark:bg-green-950/10 border-green-100 dark:border-green-900/30">
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.lowPriorityCount}</span>
            <span className="text-sm text-muted-foreground">Low Priority</span>
          </Card>
        </div>
      )}

      <TaskList
        tasks={recentTasks}
        title="Generated Tasks"
        initialSort="createdAt"
        initialDirection="desc"
        showSearch={true}
        emptyMessage="No tasks generated yet. Use the form above to create tasks with AI."
      />
    </div>
  );
};

export default AiPrompts;
