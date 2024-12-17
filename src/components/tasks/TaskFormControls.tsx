import { TaskFormInputs } from "./TaskFormInputs";
import { DatePicker } from "./DatePicker";
import { RecurringTaskControls } from "./RecurringTaskControls";

interface TaskFormControlsProps {
  title: string;
  setTitle: (title: string) => void;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  contextId: string | null;
  setContextId: (id: string | null) => void;
  deadline: Date | null;
  setDeadline: (date: Date | null) => void;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  frequency: 'daily' | 'weekly' | 'monthly';
  setFrequency: (value: 'daily' | 'weekly' | 'monthly') => void;
  selectedDays: number[];
  toggleDay: (day: number) => void;
  dailyInterval: number;
  setDailyInterval: (value: number) => void;
}

export const TaskFormControls = ({
  title,
  setTitle,
  projectId,
  setProjectId,
  contextId,
  setContextId,
  deadline,
  setDeadline,
  isRecurring,
  setIsRecurring,
  frequency,
  setFrequency,
  selectedDays,
  toggleDay,
  dailyInterval,
  setDailyInterval,
}: TaskFormControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-nowrap overflow-x-auto bg-blue-50/80 p-2 rounded-md">
      <TaskFormInputs
        title={title}
        setTitle={setTitle}
        projectId={projectId}
        setProjectId={setProjectId}
        contextId={contextId}
        setContextId={setContextId}
      />
      <DatePicker
        deadline={deadline}
        setDeadline={setDeadline}
        isRecurring={isRecurring}
      />
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
  );
};