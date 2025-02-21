
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface NoteDatePickerProps {
  dates: Date[];
  onDatesChange: (dates: Date[]) => void;
}

export const NoteDatePicker = ({ dates, onDatesChange }: NoteDatePickerProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateExists = dates.some(
      (d) => d.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );

    if (dateExists) {
      onDatesChange(dates.filter(
        (d) => d.toISOString().split('T')[0] !== date.toISOString().split('T')[0]
      ));
    } else {
      onDatesChange([...dates, date]);
    }
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    onDatesChange(dates.filter(
      (date) => date.toISOString().split('T')[0] !== dateToRemove.toISOString().split('T')[0]
    ));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Add Dates
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {dates.length > 0 && (
        <div className="space-y-2">
          {dates.map((date, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md group">
              <span>{format(date, 'PPP')}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveDate(date)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
