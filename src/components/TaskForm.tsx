
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskContext, Priority, Task, EstimationType } from '@/contexts/TaskContext';
import { Badge } from '@/components/ui/badge';

interface TaskFormProps {
  onSubmit: (formData: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Task>;
  submitText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  submitText = 'Create Task',
}) => {
  const { tags } = useTaskContext();
  
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData.dueDate ? new Date(initialData.dueDate) : undefined
  );
  const [priority, setPriority] = useState<Priority>(initialData.priority || 'medium');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData.tags || []);
  const [estimationType, setEstimationType] = useState<EstimationType>(initialData.estimationType || 'hours');
  const [estimationValue, setEstimationValue] = useState<number | null>(initialData.estimationValue || null);
  
  const handlePriorityChange = (value: string) => {
    setPriority(value as Priority);
  };
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return; // Don't submit if title is empty
    }
    
    onSubmit({
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
      tags: selectedTags,
      completed: initialData.completed || false,
      estimationType,
      estimationValue,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Due Date</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>No due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {dueDate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setDueDate(undefined)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Priority</Label>
        <RadioGroup 
          value={priority} 
          onValueChange={handlePriorityChange}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="cursor-pointer">Low</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="cursor-pointer">High</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Estimation</Label>
        <div className="flex gap-2">
          <Select 
            value={estimationType} 
            onValueChange={(value) => setEstimationType(value as EstimationType)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            min="0"
            placeholder="Value"
            value={estimationValue !== null ? estimationValue : ''}
            onChange={(e) => setEstimationValue(e.target.value ? Number(e.target.value) : null)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              style={selectedTags.includes(tag.id) 
                ? { backgroundColor: tag.color, color: 'white' } 
                : { borderColor: tag.color, color: tag.color }
              }
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-taskique-purple hover:bg-taskique-deep-purple">
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
