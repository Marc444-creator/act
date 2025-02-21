
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../../store/useStore";
import { Folder, MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskFormInputsProps {
  title: string;
  setTitle: (title: string) => void;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  contextId: string | null;
  setContextId: (id: string | null) => void;
}

export const TaskFormInputs = ({
  title,
  setTitle,
  projectId,
  setProjectId,
  contextId,
  setContextId,
}: TaskFormInputsProps) => {
  const store = useStore();

  // Map projects with their uncompleted tasks count
  const projectsWithStatus = store.projects.map(project => {
    const hasUncompletedTasks = store.tasks.some(
      task => task.projectId === project.id && !task.completed
    );
    return {
      ...project,
      statusColor: hasUncompletedTasks ? "bg-green-500" : "bg-red-500"
    };
  });

  // Sort contexts alphabetically by name
  const sortedContexts = [...store.contexts].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <Select value={projectId || "none"} onValueChange={setProjectId}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="w-8 h-8 p-0 bg-white">
                <Folder className="h-4 w-4 text-black" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <SelectContent>
          <SelectItem value="none">Project</SelectItem>
          {projectsWithStatus.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${project.statusColor}`} />
                {project.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={contextId || "none"} onValueChange={setContextId}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="w-8 h-8 p-0 bg-white">
                <MapPin className="h-4 w-4 text-black" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Context</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <SelectContent>
          <SelectItem value="none">Context</SelectItem>
          {sortedContexts.map((context) => (
            <SelectItem key={context.id} value={context.id}>
              {context.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
