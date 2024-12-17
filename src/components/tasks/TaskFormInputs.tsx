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

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full">
        <Button type="submit" className="w-8 h-8 rounded-full p-0 shrink-0 text-sm">+</Button>
        <Input
          placeholder="Add a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
      </div>
      <div className="flex items-center gap-2 flex-nowrap">
        <Select value={projectId || "none"} onValueChange={setProjectId}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-8 h-8 p-0">
                  <Folder className="h-4 w-4" />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-8 h-8 p-0">
                  <MapPin className="h-4 w-4" />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Context</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SelectContent>
            <SelectItem value="none">Context</SelectItem>
            {store.contexts.map((context) => (
              <SelectItem key={context.id} value={context.id}>
                {context.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};