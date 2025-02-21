
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';

interface HabitCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitName: string;
  completedDays: { [key: string]: boolean };
  onToggleDay: (dateStr: string) => void;
}

export const HabitCalendar = ({
  open,
  onOpenChange,
  habitName,
  completedDays,
  onToggleDay
}: HabitCalendarProps) => {
  const selectedDates = Object.entries(completedDays)
    .filter(([_, completed]) => completed)
    .map(([dateStr]) => new Date(dateStr));

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    onToggleDay(dateStr);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border border-white/10">
        <DialogHeader>
          <DialogTitle>{habitName} - Select completed days</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => {
              if (!Array.isArray(dates)) {
                handleSelect(dates);
              }
            }}
            className="bg-black text-white"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
