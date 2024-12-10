import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, RotateCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "../store/useStore";
import { toast } from "sonner";

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

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const daysOfMonth = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}${getOrdinalSuffix(i + 1)}`,
  }));

  function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

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

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 w-full">
          <Button type="submit" className="w-10 h-10 rounded-full p-0 shrink-0">+</Button>
          <Input
            placeholder="Add a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Select value={projectId || "none"} onValueChange={setProjectId}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Project</SelectItem>
              {store.projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={contextId || "none"} onValueChange={setContextId}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Context</SelectItem>
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
                  "w-[40px] p-0",
                  !deadline && "text-muted-foreground"
                )}
                title={isRecurring ? "Set first occurrence date" : "Set deadline"}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline || undefined}
                onSelect={setDeadline}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant={isRecurring ? "default" : "outline"}
            size="icon"
            onClick={() => setIsRecurring(!isRecurring)}
            className="w-[40px] p-0"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          {isRecurring && (
            <>
              <Select value={frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => {
                setFrequency(value);
                setSelectedDays([]);
              }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              {frequency === 'daily' && (
                <Select 
                  value={dailyInterval.toString()} 
                  onValueChange={(value) => setDailyInterval(parseInt(value))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((interval) => (
                      <SelectItem key={interval} value={interval.toString()}>
                        Every {interval} day{interval > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
        </div>
        
        {isRecurring && frequency === 'weekly' && (
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={selectedDays.includes(day.value)}
                  onCheckedChange={() => toggleDay(day.value)}
                />
                <label
                  htmlFor={`day-${day.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        )}

        {isRecurring && frequency === 'monthly' && (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {daysOfMonth.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={selectedDays.includes(day.value)}
                  onCheckedChange={() => toggleDay(day.value)}
                />
                <label
                  htmlFor={`day-${day.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};