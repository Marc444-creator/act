
import { Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useStore } from "@/store/useStore";

interface TaskBadgesProps {
  deadline: Date | null;
  projectId: string | null;
  contextId: string | null;
}

export const TaskBadges = ({ deadline, projectId, contextId }: TaskBadgesProps) => {
  const store = useStore();

  return (
    <div className="flex items-center gap-2 ml-6 flex-wrap">
      {deadline && (
        <Badge variant="outline" className="gap-1 text-white border-white">
          <CalendarIcon className="w-3 h-3" />
          {format(new Date(deadline), 'PP')}
        </Badge>
      )}
      {projectId && (
        <Badge
          style={{
            backgroundColor:
              store.projects.find((p) => p.id === projectId)?.color || "#8B5CF6",
          }}
        >
          {store.projects.find((p) => p.id === projectId)?.name}
        </Badge>
      )}
      {contextId && (
        <Badge
          variant="secondary"
          style={{
            backgroundColor:
              store.contexts.find((c) => c.id === contextId)?.color || "#D946EF",
          }}
        >
          {store.contexts.find((c) => c.id === contextId)?.name}
        </Badge>
      )}
    </div>
  );
};
