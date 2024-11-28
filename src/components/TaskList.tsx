import { X, Check, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "../store/useStore";
import { format } from "date-fns";

interface TaskListProps {
  filterProject: string | null;
  filterContext: string | null;
  filterStatus: string | null;
  showCompleted: boolean;
}

export const TaskList = ({ 
  filterProject, 
  filterContext, 
  filterStatus,
  showCompleted 
}: TaskListProps) => {
  const store = useStore();

  console.log('TaskList render:', {
    showCompleted,
    totalTasks: store.tasks.length,
    completedTasks: store.tasks.filter(t => t.completed).length
  });

  const filteredTasks = store.tasks.filter((task) => {
    const matchesProject = !filterProject || task.projectId === filterProject;
    const matchesContext = !filterContext || task.contextId === filterContext;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesCompleted = showCompleted || !task.completed;

    console.log('Task filtering:', {
      taskId: task.id,
      completed: task.completed,
      matchesCompleted,
      showCompleted,
      visible: matchesProject && matchesContext && matchesStatus && matchesCompleted
    });

    return matchesProject && matchesContext && matchesStatus && matchesCompleted;
  });

  return (
    <div className="space-y-2">
      {filteredTasks.map((task) => {
        const status = store.statuses.find((s) => s.id === task.status);
        
        return (
          <div
            key={task.id}
            className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center"
          >
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log('Toggling task:', {
                    taskId: task.id,
                    currentlyCompleted: task.completed
                  });
                  store.toggleTask(task.id);
                }}
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
            </div>
            <div className="flex items-center gap-2 ml-6">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.deleteTask(task.id)}
              >
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};