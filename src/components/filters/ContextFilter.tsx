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
  
  // Get only contexts that have tasks assigned
  const contextsWithTasks = store.contexts
    .filter(context => store.tasks.some(task => task.contextId === context.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Select 
      value={value || "none"} 
      onValueChange={(value) => onChange(value === "none" ? null : value)}
    >
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
        <SelectItem value="none">All Contexts</SelectItem>
        {contextsWithTasks.map((context) => (
          <SelectItem key={context.id} value={context.id}>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: context.color }}
              />
              {context.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};