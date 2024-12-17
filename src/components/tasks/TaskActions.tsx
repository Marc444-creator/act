import { X, SendHorizontal, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";

interface TaskActionsProps {
  taskId: string;
  completed: boolean;
  isRecurring: boolean;
}

export const TaskActions = ({ taskId, completed, isRecurring }: TaskActionsProps) => {
  const store = useStore();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => store.toggleTask(taskId)}
      >
        <X className={`w-4 h-4 ${completed ? "text-green-500" : ""}`} />
      </Button>
      {isRecurring && (
        <Repeat className="w-4 h-4 text-blue-500" />
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => store.moveTaskToLater(taskId)}
        className="hover:bg-gray-100"
      >
        <SendHorizontal className="w-4 h-4 text-blue-500" />
      </Button>
    </div>
  );
};