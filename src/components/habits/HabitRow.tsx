import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { Habit } from "../../store/useStore";

interface HabitRowProps {
  habit: Habit;
  displayDays: Date[];
  monthlyScore: number;
  onDelete: (id: string) => void;
  onEdit: (habit: { id: string; name: string }) => void;
  onToggleDay: (habitId: string, dateStr: string) => void;
}

export const HabitRow = ({
  habit,
  displayDays,
  monthlyScore,
  onDelete,
  onEdit,
  onToggleDay
}: HabitRowProps) => {
  return (
    <>
      <div 
        className="flex items-center justify-between pr-4 cursor-pointer hover:bg-gray-50 rounded-md"
        onClick={() => onEdit({ id: habit.id, name: habit.name })}
      >
        <span>{habit.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(habit.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-center font-semibold text-blue-600">
        {monthlyScore}
      </div>
      {displayDays.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return (
          <div key={dateStr} className="flex justify-center items-center">
            <Checkbox
              checked={habit.completedDays[dateStr] || false}
              onCheckedChange={() => onToggleDay(habit.id, dateStr)}
            />
          </div>
        );
      })}
    </>
  );
};