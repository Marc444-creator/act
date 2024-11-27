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
  const [selectedStatus, setSelectedStatus] = useState<string>("not-started");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const store = useStore();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    store.addTask({
      title: newTask,
      projectId: selectedProject,
      contextId: selectedContext,
      status: selectedStatus,
      completed: false,
      deadline,
    });
    setNewTask("");
    setDeadline(null);
    toast.success("Task added successfully!");
  };

  return (
    <form onSubmit={handleAddTask} className="flex gap-2">
      <Input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
      />
      <Select
        value={selectedProject || "none"}
        onValueChange={(value) => setSelectedProject(value === "none" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Project</SelectItem>
          {store.projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectedContext || "none"}
        onValueChange={(value) => setSelectedContext(value === "none" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Context" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Context</SelectItem>
          {store.contexts.map((context) => (
            <SelectItem key={context.id} value={context.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: context.color }}
                />
                {context.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectedStatus}
        onValueChange={setSelectedStatus}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {store.statuses.map((status) => (
            <SelectItem key={status.id} value={status.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {status.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {deadline ? format(deadline, 'PPP') : <span>Set deadline</span>}
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
      <Button type="submit">
        <Plus className="w-4 h-4" />
      </Button>
    </form>
  );
};