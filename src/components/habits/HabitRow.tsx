
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';
import type { Habit } from "../../types";

interface HabitRowProps {
  habit: Habit;
  displayDays: Date[];
  monthlyScore: number;
  weeklyAverage: string;
  yearlyScore: number;
  onDelete: (id: string) => void;
  onEdit: (habit: { id: string; name: string }) => void;
  onToggleDay: (habitId: string, dateStr: string) => void;
}

export const HabitRow = ({
  habit,
  displayDays,
  monthlyScore,
  weeklyAverage,
  yearlyScore,
  onDelete,
  onEdit,
  onToggleDay
}: HabitRowProps) => {
  return (
    <>
      <div 
        className="flex flex-col justify-center pr-2 cursor-pointer hover:bg-gray-50 rounded-md border border-white/20"
        onClick={() => onEdit({ id: habit.id, name: habit.name })}
      >
        <span className="text-sm sm:text-base font-medium">{habit.name}</span>
      </div>
      {displayDays.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return (
          <div key={dateStr} className="flex justify-center items-center border border-white/20">
            <Checkbox
              checked={habit.completedDays[dateStr] || false}
              onCheckedChange={() => onToggleDay(habit.id, dateStr)}
              className="h-4 w-4 sm:h-5 sm:w-5"
            />
          </div>
        );
      })}
      <div className="text-center font-semibold text-blue-600 text-sm sm:text-base border border-white/20" title="Monthly Score">
        {monthlyScore}
      </div>
      <div className="text-center font-semibold text-green-600 text-sm sm:text-base border border-white/20" title="Weekly Average">
        {weeklyAverage}
      </div>
      <div className="text-center font-semibold text-purple-600 text-sm sm:text-base border border-white/20" title="Yearly Score">
        {yearlyScore}
      </div>
      <div className="flex justify-center border border-white/20">
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(habit.id);
          }}
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </>
  );
};
