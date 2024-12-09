import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, RotateCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../store/useStore";
import { toast } from "sonner";

export const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [contextId, setContextId] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const store = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // For recurring tasks, we require a deadline as the first occurrence date
    if (isRecurring && !deadline) {
      toast.error("Please set a date for the first occurrence");
      return;
    }

    store.addTask({
      title: title.trim(),
      projectId: projectId || null,
      contextId: contextId || null,
      status: "not-started",
      completed: false,
      deadline: deadline,
      isForLater: false,
      recurring: isRecurring ? {
        frequency,
        lastGenerated: deadline || new Date() // Use deadline as the first occurrence date
      } : null
    });

    setTitle("");
    setProjectId(null);
    setContextId(null);
    setDeadline(null);
    setIsRecurring(false);
    setFrequency('daily');
    toast.success("Task added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 w-full">
          <Button type="submit" className="w-10 h-10 rounded-full p-0 shrink-0">+</Button>
          <Input
            placeholder="Add a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Select value={projectId || "none"} onValueChange={setProjectId}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Project</SelectItem>
              {store.projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={contextId || "none"} onValueChange={setContextId}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Context</SelectItem>
              {store.contexts.map((context) => (
                <SelectItem key={context.id} value={context.id}>
                  {context.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[40px] p-0",
                  !deadline && "text-muted-foreground"
                )}
                title={isRecurring ? "Set first occurrence date" : "Set deadline"}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline || undefined}
                onSelect={setDeadline}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant={isRecurring ? "default" : "outline"}
            size="icon"
            onClick={() => setIsRecurring(!isRecurring)}
            className="w-[40px] p-0"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          {isRecurring && (
            <Select value={frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </form>
  );
};