import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HabitsGridHeaderProps {
  displayDays: Date[];
}

export const HabitsGridHeader = ({ displayDays }: HabitsGridHeaderProps) => {
  return (
    <>
      <div className="font-semibold text-sm sm:text-base">Habitude</div>
      <div className="font-semibold text-center text-sm sm:text-base">Score</div>
      {displayDays.map((day) => (
        <div key={day.toISOString()} className="text-center font-semibold">
          <div className="text-xs sm:text-sm">
            {format(day, 'EEE', { locale: fr })}
          </div>
          <div className="text-xs text-gray-500">
            {format(day, 'd MMM')}
          </div>
        </div>
      ))}
    </>
  );
};