
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfYear, endOfYear, startOfWeek, endOfWeek, differenceInWeeks } from 'date-fns';
import { HabitsGridHeader } from './HabitsGridHeader';
import { HabitRow } from './HabitRow';
import type { Habit } from "../../types";

interface HabitsGridProps {
  habits: Habit[];
  displayDays: Date[];
  onDeleteHabit: (habitId: string) => void;
  onEditHabit: (habit: { id: string; name: string }) => void;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
}

export const HabitsGrid = ({
  habits,
  displayDays,
  onDeleteHabit,
  onEditHabit,
  onToggleHabitDay
}: HabitsGridProps) => {
  const calculateMonthlyScore = (completedDays: { [key: string]: boolean }) => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.reduce((count, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return completedDays[dateStr] ? count + 1 : count;
    }, 0);
  };

  const calculateYearlyScore = (completedDays: { [key: string]: boolean }) => {
    const today = new Date();
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const daysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    return daysInYear.reduce((count, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return completedDays[dateStr] ? count + 1 : count;
    }, 0);
  };

  const calculateWeeklyAverage = (completedDays: { [key: string]: boolean }) => {
    const today = new Date();
    const yearStart = startOfYear(today);
    let totalWeeks = differenceInWeeks(today, yearStart) + 1;
    let totalCompletedDays = 0;

    const days = eachDayOfInterval({ start: yearStart, end: today });
    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      if (completedDays[dateStr]) {
        totalCompletedDays++;
      }
    });

    return totalWeeks > 0 ? (totalCompletedDays / totalWeeks).toFixed(1) : '0';
  };

  return (
    <div className="mt-8 overflow-x-auto">
      <div className="grid grid-cols-[minmax(120px,1fr)_repeat(2,40px)_40px_50px_50px_50px_40px] sm:grid-cols-[minmax(150px,1fr)_repeat(2,50px)_50px_60px_60px_60px_50px] gap-2 sm:gap-4">
        <HabitsGridHeader displayDays={displayDays} />
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            displayDays={displayDays}
            monthlyScore={calculateMonthlyScore(habit.completedDays)}
            weeklyAverage={calculateWeeklyAverage(habit.completedDays)}
            yearlyScore={calculateYearlyScore(habit.completedDays)}
            onDelete={onDeleteHabit}
            onEdit={onEditHabit}
            onToggleDay={onToggleHabitDay}
          />
        ))}
      </div>
    </div>
  );
};
