
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "../../store/useStore";

interface ContextFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ContextFilter = ({ value, onChange }: ContextFilterProps) => {
  const store = useStore();
  
  // Get only contexts that have uncompleted tasks assigned and count their tasks
  const contextsWithTasks = store.contexts
    .map(context => ({
      ...context,
      taskCount: store.tasks.filter(task => 
        task.contextId === context.id && !task.completed
      ).length
    }))
    .filter(context => context.taskCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Select 
      value={value || "none"} 
      onValueChange={(value) => onChange(value === "none" ? null : value)}
    >
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
        <SelectItem value="none">All Contexts</SelectItem>
        {contextsWithTasks.map((context) => (
          <SelectItem key={context.id} value={context.id}>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: context.taskCount === 1 ? '#4ade80' : '#ea384c'
                }}
              />
              {context.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
