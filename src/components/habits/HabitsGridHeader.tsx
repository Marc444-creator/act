
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HabitsGridHeaderProps {
  displayDays: Date[];
}

export const HabitsGridHeader = ({ displayDays }: HabitsGridHeaderProps) => {
  return (
    <>
      <div className="font-semibold text-sm sm:text-base px-2">Habitude</div>
      {displayDays.map(day => (
        <div key={day.toString()} className="text-center font-semibold text-sm sm:text-base">
          {format(day, 'E', { locale: fr })}
        </div>
      ))}
      <div className="text-center font-semibold text-sm sm:text-base">Cal</div>
      <div className="text-center font-semibold text-sm sm:text-base">
        Mois
      </div>
      <div className="text-center font-semibold text-sm sm:text-base">
        Sem.
      </div>
      <div className="text-center font-semibold text-sm sm:text-base">
        An
      </div>
      <div className="text-center font-semibold text-sm sm:text-base">
        
      </div>
    </>
  );
};
