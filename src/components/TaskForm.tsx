import { useState } from "react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../store/useStore";
import { toast } from "sonner";
import { format } from "date-fns";

export const TaskForm = () => {
  const [newTask, setNewTask] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);

  const store = useStore();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    store.addTask({
      title: newTask,
      projectId: selectedProject,
      contextId: selectedContext,
      status: "not-started",
      completed: false,
      deadline,
    });
    setNewTask("");
    setDeadline(null);
    toast.success("Task added successfully!");
  };

  return (
    <form onSubmit={handleAddTask} className="flex flex-col gap-2">
      <Input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
      />
      <div className="flex gap-2 items-center">
        <Select
          value={selectedProject || "none"}
          onValueChange={(value) => setSelectedProject(value === "none" ? null : value)}
        >
          <SelectTrigger className="text-xs w-[140px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Project</SelectItem>
            {store.projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-xs">{project.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedContext || "none"}
          onValueChange={(value) => setSelectedContext(value === "none" ? null : value)}
        >
          <SelectTrigger className="text-xs w-[140px]">
            <SelectValue placeholder="Context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Context</SelectItem>
            {store.contexts.map((context) => (
              <SelectItem key={context.id} value={context.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: context.color }}
                  />
                  <span className="text-xs">{context.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-xs w-[140px]">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {deadline ? format(deadline, 'PP') : <span>Deadline</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};