import { X, Check, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "../store/useStore";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskListProps {
  filterProject: string | null;
  filterContext: string | null;
}

export const TaskList = ({ filterProject, filterContext }: TaskListProps) => {
  const store = useStore();

  const filteredTasks = store.tasks.filter((task) => {
    const matchesProject = !filterProject || task.projectId === filterProject;
    const matchesContext = !filterContext || task.contextId === filterContext;
    return matchesProject && matchesContext;
  });

  return (
    <div className="space-y-2">
      {filteredTasks.map((task) => {
        const status = store.statuses.find((s) => s.id === task.status);
        
        return (
          <div
            key={task.id}
            className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => store.toggleTask(task.id)}
            >
              {task.completed ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 rounded-full" />
              )}
            </Button>
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </span>
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
            {status && (
              <Badge
                style={{
                  backgroundColor: status.color,
                }}
              >
                {status.name}
              </Badge>
            )}
            <Select
              value={task.status}
              onValueChange={(value) => store.updateTaskStatus(task.id, value)}
            >
              <SelectTrigger className="w-[140px]">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => store.deleteTask(task.id)}
            >
              <X className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};