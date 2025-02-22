
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  deadline: Date | null;
  setDeadline: (date: Date | null) => void;
  isRecurring: boolean;
}

export const DatePicker = ({ deadline, setDeadline, isRecurring }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-8 h-8 p-0 bg-black text-white border-white/10",
            !deadline && "text-white"
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
  );
};
