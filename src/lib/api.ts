
import { toast } from "sonner";

export const BASE_URL = "https://techpix-hackathon-task-management.onrender.com";

export interface ApiTask {
  _id?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  estimation_type: "minutes" | "hours" | "days";
  estimation_value: number | null;
  completed?: boolean;
  status?: "pending" | "completed";
  created_at: string | null;
  updated_at: string | null;
}

export interface TasksResponse {
  message?: string;
  tasks: ApiTask[];
  metadata?: {
    total_tasks: number;
    high_priority_count: number;
    medium_priority_count: number;
    low_priority_count: number;
    total_estimated_time: string;
    total_estimated_hours: number;
  };
}

export interface TaskResponse {
  message: string;
  task: ApiTask;
}

export interface AiPromptRequest {
  input_text: string;
}

// Utility function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return await response.json() as T;
};

// API functions
export const fetchTasks = async (): Promise<TasksResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`);
    return await handleResponse<TasksResponse>(response);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to fetch tasks");
    throw error;
  }
};

export const createTask = async (taskData: Omit<ApiTask, "_id">): Promise<TaskResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    
    const data = await handleResponse<TaskResponse>(response);
    toast.success(data.message || "Task created successfully");
    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to create task");
    throw error;
  }
};

export const updateTask = async (taskId: string, taskData: Partial<ApiTask>): Promise<TaskResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    
    const data = await handleResponse<TaskResponse>(response);
    toast.success(data.message || "Task updated successfully");
    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to update task");
    throw error;
  }
};

export const updateTaskStatus = async (taskId: string, status: "pending" | "completed"): Promise<TaskResponse> => {
  try {
    // The API expects a PUT request for updating task status, not PATCH
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, completed: status === "completed" }),
    });
    
    const data = await handleResponse<TaskResponse>(response);
    toast.success(data.message || `Task marked as ${status}`);
    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to update task status");
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });
    
    const data = await handleResponse<{ message: string }>(response);
    toast.success(data.message || "Task deleted successfully");
    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to delete task");
    throw error;
  }
};

export const processAiTasks = async (inputText: string): Promise<TasksResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/process-tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input_text: inputText }),
    });
    
    const data = await handleResponse<TasksResponse>(response);
    toast.success(data.message || "AI tasks processed successfully");
    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to process AI tasks");
    throw error;
  }
};
