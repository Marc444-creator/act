
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "../../store/useStore";
import { MapPin } from "lucide-react";

interface ContextFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ContextFilter = ({ value, onChange }: ContextFilterProps) => {
  const store = useStore();

  // Filter contexts to only show those with uncompleted tasks
  const contextsWithUncompletedTasks = store.contexts.filter(context => {
    return store.tasks.some(task => 
      task.contextId === context.id && !task.completed
    );
  });

  return (
    <Select
      value={value || "none"}
      onValueChange={(value) => onChange(value === "none" ? null : value)}
    >
      <SelectTrigger className="w-[60px] bg-black text-white border-white/10">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-white" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">All Contexts</SelectItem>
        {contextsWithUncompletedTasks.map((context) => (
          <SelectItem key={context.id} value={context.id}>
            {context.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
