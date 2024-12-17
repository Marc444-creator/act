import { useState } from "react";
import { useStore } from "../store/useStore";
import { toast } from "sonner";
import { TaskFormHeader } from "./tasks/TaskFormHeader";
import { TaskFormControls } from "./tasks/TaskFormControls";

export const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [contextId, setContextId] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [dailyInterval, setDailyInterval] = useState(1);
  const store = useStore();

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isRecurring && !deadline) {
      toast.error("Please set a date for the first occurrence");
      return;
    }

    if (isRecurring && frequency !== 'daily' && selectedDays.length === 0) {
      toast.error(`Please select at least one ${frequency === 'weekly' ? 'day of the week' : 'day of the month'}`);
      return;
    }

    store.addTask({
      title: title.trim(),
      projectId: projectId || null,
      contextId: contextId || null,
      status: "not-started",
      completed: false,
      deadline: deadline,
      isForLater: false,
      recurring: isRecurring ? {
        frequency,
        lastGenerated: deadline || new Date(),
        daysOfWeek: frequency === 'weekly' ? selectedDays : undefined,
        daysOfMonth: frequency === 'monthly' ? selectedDays : undefined,
        interval: frequency === 'daily' ? dailyInterval : undefined
      } : null
    });

    setTitle("");
    setProjectId(null);
    setContextId(null);
    setDeadline(null);
    setIsRecurring(false);
    setFrequency('daily');
    setSelectedDays([]);
    setDailyInterval(1);
    toast.success("Task added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50/50 p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <TaskFormHeader title={title} setTitle={setTitle} />
        <TaskFormControls
          title={title}
          setTitle={setTitle}
          projectId={projectId}
          setProjectId={setProjectId}
          contextId={contextId}
          setContextId={setContextId}
          deadline={deadline}
          setDeadline={setDeadline}
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
    </form>
  );
};