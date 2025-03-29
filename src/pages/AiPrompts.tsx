
import { useState } from "react";
import { toast } from "sonner";
import { SparkleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TaskList from "@/components/TaskList";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useTaskContext } from "@/contexts/TaskContext";

const AiPrompts = () => {
  const [prompt, setPrompt] = useState("");
  const [processing, setProcessing] = useState(false);
  const { tasks, processAiPrompt, isLoading, stats } = useTaskContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setProcessing(true);
    
    try {
      await processAiPrompt(prompt);
      setPrompt(""); // Clear input on success
    } catch (error) {
      console.error("Error processing AI prompt:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Filter to show most recently created tasks (last 5 if processed by AI)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Task Assistant</h1>
        <p className="text-muted-foreground">
          Generate tasks from your text input using our AI assistant
        </p>
      </div>
      
      <div className="rounded-lg border p-6 bg-taskique-soft-gray dark:bg-gray-800/30">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Enter your prompt or task list description
            </label>
            <Textarea
              id="prompt"
              placeholder="Example: Create monthly sales report, fix payment gateway bug, design new homepage..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px]"
              disabled={processing}
            />
          </div>
          
          <Button
            type="submit"
            className="bg-taskique-purple hover:bg-taskique-deep-purple"
            disabled={processing || !prompt.trim()}
          >
            {processing ? (
              <>
                <LoadingIndicator size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              <>
                <SparkleIcon className="mr-2 h-4 w-4" />
                Generate Tasks
              </>
            )}
          </Button>
        </form>
      </div>
      
      {/* Task Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4 bg-taskique-soft-gray dark:bg-gray-800/30">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <h3 className="text-2xl font-bold">{stats.totalTasks}</h3>
          </div>
          <div className="rounded-lg border p-4 bg-taskique-soft-gray dark:bg-gray-800/30">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <h3 className="text-2xl font-bold text-red-500">{stats.highPriorityCount}</h3>
          </div>
          <div className="rounded-lg border p-4 bg-taskique-soft-gray dark:bg-gray-800/30">
            <p className="text-sm text-muted-foreground">Medium Priority</p>
            <h3 className="text-2xl font-bold text-amber-500">{stats.mediumPriorityCount}</h3>
          </div>
          <div className="rounded-lg border p-4 bg-taskique-soft-gray dark:bg-gray-800/30">
            <p className="text-sm text-muted-foreground">Low Priority</p>
            <h3 className="text-2xl font-bold text-green-500">{stats.lowPriorityCount}</h3>
          </div>
        </div>
      )}
      
      {/* Recent AI Generated Tasks */}
      <TaskList
        tasks={recentTasks}
        title="Recently Generated Tasks"
        initialSort="createdAt"
        initialDirection="desc"
        emptyMessage="No AI-generated tasks yet"
      />
      
      {isLoading && <LoadingIndicator fullScreen />}
    </div>
  );
};

export default AiPrompts;
