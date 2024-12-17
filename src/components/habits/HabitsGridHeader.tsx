import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HabitsGridHeaderProps {
  displayDays: Date[];
}

export const HabitsGridHeader = ({ displayDays }: HabitsGridHeaderProps) => {
  return (
    <>
      <div className="font-semibold text-gray-500">Habitude</div>
      {displayDays.map((day) => (
        <div key={day.toString()} className="text-center font-medium text-gray-500 text-sm">
          {format(day, 'E', { locale: fr })}
        </div>
      ))}
      <div className="text-center font-medium text-gray-500 text-sm">
        Mois
      </div>
      <div className="text-center font-medium text-gray-500 text-sm">
        Sem.
      </div>
      <div className="text-center font-medium text-gray-500 text-sm">
        An
      </div>
      <div></div>
    </>
  );
};