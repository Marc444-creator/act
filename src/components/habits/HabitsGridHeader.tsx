
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trophy } from "lucide-react";

interface HabitsGridHeaderProps {
  displayDays: Date[];
}

export const HabitsGridHeader = ({ displayDays }: HabitsGridHeaderProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <>
        <div className="font-semibold text-sm sm:text-base px-2">Habitude</div>
        {displayDays.map(day => (
          <div key={day.toString()} className="text-center font-semibold text-sm sm:text-base">
            {format(day, 'E', { locale: fr })}
          </div>
        ))}
        <div className="text-center font-semibold text-sm sm:text-base">Cal</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full text-center font-semibold text-sm sm:text-base cursor-help">
              <Trophy className="h-4 w-4 mx-auto" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nombre d'occurrences cette semaine</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full text-center font-semibold text-sm sm:text-base cursor-help">
              W
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Moyenne hebdomadaire depuis le début de l'année</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full text-center font-semibold text-sm sm:text-base cursor-help">
              M
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total nombre d'occurrences dans le mois en cours</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full text-center font-semibold text-sm sm:text-base cursor-help">
              Y
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total annuel</p>
          </TooltipContent>
        </Tooltip>
        <div className="text-center font-semibold text-sm sm:text-base">
          
        </div>
      </>
    </TooltipProvider>
  );
};
