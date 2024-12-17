import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RecurringTaskControls } from "./RecurringTaskControls";
import { useStore } from "@/store/useStore";

interface TaskEditDialogProps {
  task: any;
  editingTaskId: string | null;
  editedTitle: string;
  editedProjectId: string | null;
  editedContextId: string | null;
  editedDeadline: Date | null;
  onEditSubmit: (taskId: string) => void;
  setEditedTitle: (title: string) => void;
  setEditedProjectId: (projectId: string | null) => void;
  setEditedContextId: (contextId: string | null) => void;
  setEditedDeadline: (deadline: Date | null) => void;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  frequency: 'daily' | 'weekly' | 'monthly';
  setFrequency: (value: 'daily' | 'weekly' | 'monthly') => void;
  selectedDays: number[];
  toggleDay: (day: number) => void;
  dailyInterval: number;
  setDailyInterval: (value: number) => void;
}

export const TaskEditDialog = ({
  task,
  editingTaskId,
  editedTitle,
  editedProjectId,
  editedContextId,
  editedDeadline,
  onEditSubmit,
  setEditedTitle,
  setEditedProjectId,
  setEditedContextId,
  setEditedDeadline,
  isRecurring,
  setIsRecurring,
  frequency,
  setFrequency,
  selectedDays,
  toggleDay,
  dailyInterval,
  setDailyInterval,
}: TaskEditDialogProps) => {
  const store = useStore();

  return (
    <Dialog open={editingTaskId === task.id} onOpenChange={() => onEditSubmit(task.id)}>
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
  );
};