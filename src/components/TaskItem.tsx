import { Check, Calendar as CalendarIcon, X, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RecurringTaskControls } from "./tasks/RecurringTaskControls";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStore } from "../store/useStore";
import { useState } from "react";

interface TaskItemProps {
  task: any;
  editingTaskId: string | null;
  editedTitle: string;
  editedProjectId: string | null;
  editedContextId: string | null;
  editedDeadline: Date | null;
  onTaskClick: (task: any) => void;
  onEditSubmit: (taskId: string) => void;
  setEditedTitle: (title: string) => void;
  setEditedProjectId: (projectId: string | null) => void;
  setEditedContextId: (contextId: string | null) => void;
  setEditedDeadline: (deadline: Date | null) => void;
}

export const TaskItem = ({
  task,
  editingTaskId,
  editedTitle,
  editedProjectId,
  editedContextId,
  editedDeadline,
  onTaskClick,
  onEditSubmit,
  setEditedTitle,
  setEditedProjectId,
  setEditedContextId,
  setEditedDeadline,
}: TaskItemProps) => {
  const store = useStore();
  const [isRecurring, setIsRecurring] = useState(!!task.recurring);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    task.recurring?.frequency || 'daily'
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    task.recurring?.daysOfWeek || task.recurring?.daysOfMonth || []
  );
  const [dailyInterval, setDailyInterval] = useState(task.recurring?.interval || 1);

  const handleEditSubmit = () => {
    const updates: any = {
      title: editedTitle,
      projectId: editedProjectId,
      contextId: editedContextId,
      deadline: editedDeadline,
      recurring: isRecurring ? {
        frequency,
        lastGenerated: editedDeadline || new Date(),
        daysOfWeek: frequency === 'weekly' ? selectedDays : undefined,
        daysOfMonth: frequency === 'monthly' ? selectedDays : undefined,
        interval: frequency === 'daily' ? dailyInterval : undefined
      } : null
    };

    store.updateTask(task.id, updates);
    onEditSubmit(task.id);
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => store.toggleTask(task.id)}
          >
            {task.completed ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => store.moveTaskToLater(task.id)}
            className="hover:bg-gray-100"
          >
            <SendHorizontal className="w-4 h-4 text-blue-500" />
          </Button>
          <span
            className={`flex-1 cursor-pointer ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
            onClick={() => onTaskClick(task)}
          >
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-6 flex-wrap">
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
        </div>
      </div>

      <Dialog open={editingTaskId === task.id} onOpenChange={() => handleEditSubmit()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Task title"
                className="col-span-3"
              />
              <Select 
                value={editedProjectId || "none"} 
                onValueChange={(value) => setEditedProjectId(value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {store.projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={editedContextId || "none"} 
                onValueChange={(value) => setEditedContextId(value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Context</SelectItem>
                  {store.contexts.map((context) => (
                    <SelectItem key={context.id} value={context.id}>
                      {context.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editedDeadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedDeadline ? format(editedDeadline, 'PP') : <span>Pick a deadline</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedDeadline || undefined}
                    onSelect={setEditedDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
                <RecurringTaskControls
                  isRecurring={isRecurring}
                  setIsRecurring={setIsRecurring}
                  frequency={frequency}
                  setFrequency={setFrequency}
                  selectedDays={selectedDays}
                  toggleDay={toggleDay}
                  dailyInterval={dailyInterval}
                  setDailyInterval={setDailyInterval}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};