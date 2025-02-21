
import { useState } from "react";
import { useStore } from "../store/useStore";
import { TaskActions } from "./tasks/TaskActions";
import { TaskBadges } from "./tasks/TaskBadges";
import { TaskEditDialog } from "./tasks/TaskEditDialog";

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
          <div>
            <TaskActions
              taskId={task.id}
              completed={task.completed}
              isRecurring={!!task.recurring}
            />
          </div>
          <span
            className={`flex-1 cursor-pointer text-black ${
              task.completed ? "line-through text-black/40" : ""
            }`}
            onClick={() => onTaskClick(task)}
          >
            {task.title}
          </span>
        </div>
        <TaskBadges
          deadline={task.deadline}
          projectId={task.projectId}
          contextId={task.contextId}
        />
      </div>

      <TaskEditDialog
        task={task}
        editingTaskId={editingTaskId}
        editedTitle={editedTitle}
        editedProjectId={editedProjectId}
        editedContextId={editedContextId}
        editedDeadline={editedDeadline}
        onEditSubmit={handleEditSubmit}
        setEditedTitle={setEditedTitle}
        setEditedProjectId={setEditedProjectId}
        setEditedContextId={setEditedContextId}
        setEditedDeadline={setEditedDeadline}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        frequency={frequency}
        setFrequency={setFrequency}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        dailyInterval={dailyInterval}
        setDailyInterval={setDailyInterval}
      />
    </>
  );
};
