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
    <form onSubmit={handleAddTask} className="flex flex-col gap-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex gap-2">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border-blue-300 focus:border-blue-500"
        />
        <Button type="submit" size="icon" className="h-10 w-10 shrink-0 bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <Select
          value={selectedProject || "none"}
          onValueChange={(value) => setSelectedProject(value === "none" ? null : value)}
        >
          <SelectTrigger className="text-xs w-[140px] border-blue-300 focus:border-blue-500">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-[11px]">Projects</SelectItem>
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
          <SelectTrigger className="text-xs w-[140px] border-blue-300 focus:border-blue-500">
            <SelectValue placeholder="Context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-[11px]">Contexts</SelectItem>
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
            <Button variant="outline" className="text-xs w-[140px] border-blue-300 hover:bg-blue-100">
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
      </div>
    </form>
  );
};