import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useStore } from "../../store/useStore";
import { toast } from "sonner";

interface ContextSectionProps {
  onAddClick: () => void;
}

export const ContextSection = ({ onAddClick }: ContextSectionProps) => {
  const store = useStore();
  const sortedContexts = [...store.contexts].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleDeleteContext = (contextId: string) => {
    if (confirm("Are you sure you want to delete this context? This will remove the context from all associated tasks.")) {
      store.deleteContext(contextId);
      toast.success("Context deleted successfully!");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Contexts</h2>
      <Button onClick={onAddClick}>Add Context</Button>
      <div className="space-y-2">
        {sortedContexts.map((context) => (
          <div
            key={context.id}
            className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg shadow group"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: context.color }}
              />
              <span>{context.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteContext(context.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};