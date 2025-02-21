
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw } from "lucide-react";

interface RecurringTaskControlsProps {
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  frequency: 'daily' | 'weekly' | 'monthly';
  setFrequency: (value: 'daily' | 'weekly' | 'monthly') => void;
  selectedDays: number[];
  toggleDay: (day: number) => void;
  dailyInterval: number;
  setDailyInterval: (value: number) => void;
}

export const RecurringTaskControls = ({
  isRecurring,
  setIsRecurring,
  frequency,
  setFrequency,
  selectedDays,
  toggleDay,
  dailyInterval,
  setDailyInterval,
}: RecurringTaskControlsProps) => {
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

  return (
    <>
      <Button
        type="button"
        variant={isRecurring ? "default" : "outline"}
        size="icon"
        onClick={() => setIsRecurring(!isRecurring)}
        className="w-8 h-8 p-0 bg-white text-black hover:bg-white/90 hover:text-black"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      
      {isRecurring && (
        <>
          <Select value={frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => {
            setFrequency(value);
          }}>
            <SelectTrigger className="w-[90px] bg-white text-black">
              <SelectValue placeholder="Freq" />
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
              <SelectTrigger className="w-[90px] bg-white text-black">
                <SelectValue placeholder="Every" />
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

          {frequency === 'weekly' && (
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

          {frequency === 'monthly' && (
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
        </>
      )}
    </>
  );
};
