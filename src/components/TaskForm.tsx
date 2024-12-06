import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
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
  const store = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    store.addTask({
      title: title.trim(),
      projectId: projectId || null,
      contextId: contextId || null,
      status: "not-started",
      completed: false,
      deadline: deadline,
      isForLater: false
    });

    setTitle("");
    setProjectId(null);
    setContextId(null);
    setDeadline(null);
    toast.success("Task added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Add a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Select value={projectId || "none"} onValueChange={setProjectId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Project</SelectItem>
            {store.projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={contextId || "none"} onValueChange={setContextId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Context</SelectItem>
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
                "w-[180px] justify-start text-left font-normal",
                !deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, "PPP") : <span>Deadline</span>}
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
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  );
};