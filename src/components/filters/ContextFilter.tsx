
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "../../store/useStore";
import { MapPin } from "lucide-react";

interface ContextFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ContextFilter = ({ value, onChange }: ContextFilterProps) => {
  const store = useStore();

  // Filter and sort contexts alphabetically by name
  const contextsWithUncompletedTasks = store.contexts
    .filter(context => {
      return store.tasks.some(task => 
        task.contextId === context.id && !task.completed
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(context => {
      const uncompletedCount = store.tasks.filter(
        task => task.contextId === context.id && !task.completed
      ).length;
      return { ...context, uncompletedCount };
    });

  const getStatusDotColor = (count: number) => {
    if (count === 1) return "bg-green-500";
    if (count === 2) return "bg-orange-500";
    return "bg-red-500";
  };

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
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${getStatusDotColor(context.uncompletedCount)}`}
              />
              {context.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
