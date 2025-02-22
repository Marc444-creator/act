
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Calendar } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import type { Habit } from "../../types";
import { HabitCalendar } from "./HabitCalendar";

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
  const [showCalendar, setShowCalendar] = useState(false);

  const calculateCurrentWeekScore = () => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return daysInWeek.reduce((count, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return habit.completedDays[dateStr] ? count + 1 : count;
    }, 0);
  };

  const currentWeekScore = calculateCurrentWeekScore();
  const isAboveAverage = currentWeekScore > parseFloat(weeklyAverage);

  return (
    <>
      <div 
        className="flex items-center justify-between pr-2 cursor-pointer hover:bg-gray-50 rounded-md border border-white/20"
        onClick={() => onEdit({ id: habit.id, name: habit.name })}
      >
        <span className="text-sm sm:text-base font-medium px-2 py-1">
          {habit.name}
        </span>
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

      <div className="flex justify-center items-center border border-white/20">
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            setShowCalendar(true);
          }}
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div className="flex justify-center items-center min-h-[2.5rem] font-semibold text-sm sm:text-base border border-white/20" title="Current Week Score">
        <span className={isAboveAverage ? 'text-green-600' : 'text-red-600'}>{currentWeekScore}</span>
      </div>

      <div className="flex justify-center items-center min-h-[2.5rem] font-semibold text-green-600 text-sm sm:text-base border border-white/20" title="Weekly Average">
        {weeklyAverage}
      </div>
      <div className="flex justify-center items-center min-h-[2.5rem] font-semibold text-blue-600 text-sm sm:text-base border border-white/20" title="Monthly Score">
        {monthlyScore}
      </div>
      <div className="flex justify-center items-center min-h-[2.5rem] font-semibold text-purple-600 text-sm sm:text-base border border-white/20" title="Yearly Score">
        {yearlyScore}
      </div>
      <div className="flex justify-center items-center min-h-[2.5rem] border border-white/20">
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

      <HabitCalendar
        open={showCalendar}
        onOpenChange={setShowCalendar}
        habitName={habit.name}
        completedDays={habit.completedDays}
        onToggleDay={(dateStr) => onToggleDay(habit.id, dateStr)}
      />
    </>
  );
};
