import React, { useState, useEffect } from 'react';
import { subDays, format } from 'date-fns';
import { toast } from "sonner";
import { FormNavigation } from "../components/FormNavigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "../store/useStore";
import { HabitForm } from "../components/habits/HabitForm";
import { HabitsHeader } from "../components/habits/HabitsHeader";
import { HabitsGrid } from "../components/habits/HabitsGrid";
import { HabitReminderDialog } from "../components/habits/HabitReminderDialog";

const Habits = () => {
  const [editingHabit, setEditingHabit] = useState<{ id: string; name: string } | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const { habits, deleteHabit, toggleHabitDay, updateHabit, remindersEnabled } = useStore();

  useEffect(() => {
    const checkHabits = () => {
      if (!remindersEnabled) return;
      
      const lastShownDate = localStorage.getItem('lastReminderDate');
      const today = format(new Date(), 'yyyy-MM-dd');
      
      if (lastShownDate === today) return;

      const threeDaysAgo = subDays(new Date(), 3);
      const untickedHabits = habits.filter(habit => {
        const recentDays = [0, 1, 2].map(days => 
          format(subDays(new Date(), days), 'yyyy-MM-dd')
        );
        return !recentDays.some(day => habit.completedDays[day]);
      });

      if (untickedHabits.length > 0) {
        setShowReminder(true);
        localStorage.setItem('lastReminderDate', today);
      }
    };

    checkHabits();
  }, [habits, remindersEnabled]);

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette habitude ?")) {
      deleteHabit(habitId);
      toast.success("Habitude supprimée!");
    }
  };

  const handleEditHabit = () => {
    if (editingHabit) {
      if (!editingHabit.name.trim()) {
        toast.error("Le nom de l'habitude ne peut pas être vide");
        return;
      }
      updateHabit(editingHabit.id, editingHabit.name);
      setEditingHabit(null);
      toast.success("Habitude mise à jour!");
    }
  };

  const today = new Date();
  const displayDays = [
    subDays(today, 1),
    today
  ];

  const untickedHabits = habits.filter(habit => {
    const recentDays = [0, 1, 2].map(days => 
      format(subDays(new Date(), days), 'yyyy-MM-dd')
    );
    return !recentDays.some(day => habit.completedDays[day]);
  }).map(habit => habit.name);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="bg-black/50 p-4 sm:p-6 rounded-lg shadow-sm space-y-6 border border-white/10">
          <HabitsHeader />
          
          <div className="bg-blue-100/10 p-4 rounded-lg">
            <HabitForm />
          </div>

          <HabitsGrid
            habits={habits}
            displayDays={displayDays}
            onDeleteHabit={handleDeleteHabit}
            onEditHabit={setEditingHabit}
            onToggleHabitDay={toggleHabitDay}
          />
        </div>
      </div>

      <Dialog open={!!editingHabit} onOpenChange={() => setEditingHabit(null)}>
        <DialogContent className="bg-black text-white border border-white/10">
          <DialogHeader>
            <DialogTitle>Modifier l'habitude</DialogTitle>
          </DialogHeader>
          <Input
            value={editingHabit?.name || ''}
            onChange={(e) => setEditingHabit(prev => prev ? { ...prev, name: e.target.value } : null)}
            placeholder="Nom de l'habitude"
            className="bg-black text-white border-white/10"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHabit(null)}>Annuler</Button>
            <Button onClick={handleEditHabit}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <HabitReminderDialog 
        open={showReminder} 
        onOpenChange={setShowReminder}
        untickedHabits={untickedHabits}
      />
    </div>
  );
};

export default Habits;
