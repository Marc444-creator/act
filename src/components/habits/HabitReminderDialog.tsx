import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HabitReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  untickedHabits: string[];
}

export const HabitReminderDialog = ({ open, onOpenChange, untickedHabits }: HabitReminderDialogProps) => {
  if (untickedHabits.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rappel de vos habitudes</DialogTitle>
          <DialogDescription className="pt-2">
            Les habitudes suivantes n'ont pas été cochées depuis 3 jours :
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {untickedHabits.map((habit, index) => (
                <li key={index} className="text-blue-600">{habit}</li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};