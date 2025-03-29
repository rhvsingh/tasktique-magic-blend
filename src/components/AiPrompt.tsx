
import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useTaskContext } from "@/contexts/TaskContext";

const AiPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { processAiPrompt, isLoading, stats } = useTaskContext();

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

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-background to-slate-100/50 dark:from-background dark:to-slate-900/30 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center space-x-2">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">AI</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Task Assistant</h3>
          <p className="text-sm text-muted-foreground">
            Enter task descriptions and let AI organize them for you
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Enter tasks or project descriptions (e.g. 'Create a new landing page for our product, design a logo, write copy for the homepage...')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20"
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            AI will analyze your text and create structured tasks
          </span>
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

      {stats && stats.totalTasks > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="font-medium mb-2">Task Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-background p-2 rounded-md border border-slate-200 dark:border-slate-800">
              <p className="text-muted-foreground">Total Tasks</p>
              <p className="font-medium text-lg">{stats.totalTasks}</p>
            </div>
            <div className="bg-background p-2 rounded-md border border-red-100 dark:border-red-900/30">
              <p className="text-muted-foreground">High Priority</p>
              <p className="font-medium text-lg text-red-600 dark:text-red-400">{stats.highPriorityCount}</p>
            </div>
            <div className="bg-background p-2 rounded-md border border-amber-100 dark:border-amber-900/30">
              <p className="text-muted-foreground">Medium Priority</p>
              <p className="font-medium text-lg text-amber-600 dark:text-amber-400">{stats.mediumPriorityCount}</p>
            </div>
            <div className="bg-background p-2 rounded-md border border-green-100 dark:border-green-900/30">
              <p className="text-muted-foreground">Low Priority</p>
              <p className="font-medium text-lg text-green-600 dark:text-green-400">{stats.lowPriorityCount}</p>
            </div>
            <div className="col-span-2 bg-background p-2 rounded-md border border-slate-200 dark:border-slate-800">
              <p className="text-muted-foreground">Total Estimated Time</p>
              <p className="font-medium text-lg">{stats.totalEstimatedTime}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AiPrompt;
