import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [newTask, setNewTask] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("not-started");

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
    });
    setNewTask("");
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
      <Button type="submit">
        <Plus className="w-4 h-4" />
      </Button>
    </form>
  );
};