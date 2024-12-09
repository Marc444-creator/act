import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HabitsGridHeaderProps {
  displayDays: Date[];
}

export const HabitsGridHeader = ({ displayDays }: HabitsGridHeaderProps) => {
  return (
    <>
      <div className="font-semibold">Habitude</div>
      <div className="font-semibold text-center">Score</div>
      {displayDays.map((day) => (
        <div key={day.toISOString()} className="text-center font-semibold">
          {format(day, 'EEE', { locale: fr })}
          <div className="text-sm text-gray-500">
            {format(day, 'd MMM')}
          </div>
        </div>
      ))}
    </>
  );
};