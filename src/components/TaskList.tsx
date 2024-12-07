import { Check, Calendar as CalendarIcon, X, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "../store/useStore";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TaskListProps {
  filterProject: string | null;
  filterContext: string | null;
  filterStatus: string | null;
  showCompleted: boolean;
  isForLater?: boolean;
  sortOrder?: "asc" | "desc";
}

export const TaskList = ({ 
  filterProject, 
  filterContext, 
  filterStatus,
  showCompleted,
  isForLater = false,
  sortOrder = "asc"
}: TaskListProps) => {
  const store = useStore();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedProjectId, setEditedProjectId] = useState<string | null>(null);
  const [editedContextId, setEditedContextId] = useState<string | null>(null);
  const [editedDeadline, setEditedDeadline] = useState<Date | null>(null);

  const handleTaskClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedProjectId(task.projectId);
    setEditedContextId(task.contextId);
    setEditedDeadline(task.deadline);
  };

  const handleEditSubmit = (taskId: string) => {
    if (editedTitle.trim()) {
      store.updateTask(taskId, {
        title: editedTitle.trim(),
        projectId: editedProjectId,
        contextId: editedContextId,
        deadline: editedDeadline,
      });
      toast.success("Task updated successfully!");
    }
    setEditingTaskId(null);
    setEditedTitle("");
    setEditedProjectId(null);
    setEditedContextId(null);
    setEditedDeadline(null);
  };

  const handleMoveToLater = (taskId: string) => {
    store.moveTaskToLater(taskId);
    toast.success("Task moved successfully!");
  };

  let filteredTasks = store.tasks.filter((task) => {
    const matchesProject = !filterProject || task.projectId === filterProject;
    const matchesContext = !filterContext || task.contextId === filterContext;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesCompleted = showCompleted || !task.completed;
    const matchesForLater = task.isForLater === isForLater;

    return matchesProject && matchesContext && matchesStatus && matchesCompleted && matchesForLater;
  });

  if (isForLater && sortOrder) {
    filteredTasks.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return sortOrder === "asc" 
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    });
  }

  return (
    <div className="space-y-2">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center"
        >
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => store.toggleTask(task.id)}
            >
              {task.completed ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMoveToLater(task.id)}
              className="hover:bg-gray-100"
            >
              <SendHorizontal className="w-4 h-4 text-blue-500" />
            </Button>
            {editingTaskId === task.id ? (
              <div className="flex-1 flex gap-2 items-center">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => handleEditSubmit(task.id)}
                  autoFocus
                  className="flex-1"
                />
                <Select value={editedProjectId || "none"} onValueChange={setEditedProjectId}>
                  <SelectTrigger className="w-[140px]">
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
                <Select value={editedContextId || "none"} onValueChange={setEditedContextId}>
                  <SelectTrigger className="w-[140px]">
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
                        "w-[40px] p-0",
                        !editedDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedDeadline || undefined}
                      onSelect={setEditedDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <span
                className={`flex-1 cursor-pointer ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
                onClick={() => handleTaskClick(task)}
              >
                {task.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 ml-6 flex-wrap">
            {task.deadline && (
              <Badge variant="outline" className="gap-1">
                <CalendarIcon className="w-3 h-3" />
                {format(new Date(task.deadline), 'PP')}
              </Badge>
            )}
            {task.projectId && (
              <Badge
                style={{
                  backgroundColor:
                    store.projects.find((p) => p.id === task.projectId)
                      ?.color || "#8B5CF6",
                }}
              >
                {store.projects.find((p) => p.id === task.projectId)?.name}
              </Badge>
            )}
            {task.contextId && (
              <Badge
                variant="secondary"
                style={{
                  backgroundColor:
                    store.contexts.find((c) => c.id === task.contextId)
                      ?.color || "#D946EF",
                }}
              >
                {store.contexts.find((c) => c.id === task.contextId)?.name}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};