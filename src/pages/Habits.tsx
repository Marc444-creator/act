import React, { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { toast } from "sonner";
import { FormNavigation } from "../components/FormNavigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "../store/useStore";
import { HabitForm } from "../components/habits/HabitForm";
import { HabitsGridHeader } from "../components/habits/HabitsGridHeader";
import { HabitRow } from "../components/habits/HabitRow";

const Habits = () => {
  const [editingHabit, setEditingHabit] = useState<{ id: string; name: string } | null>(null);
  const { habits, deleteHabit, toggleHabitDay, updateHabit } = useStore();

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

  const today = new Date();
  const displayDays = [
    subDays(today, 2),
    subDays(today, 1),
    today
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h1 className="text-3xl font-bold">Mes Habitudes</h1>
          
          <HabitForm />

          <div className="mt-8">
            <div className="grid grid-cols-[200px_80px_repeat(3,1fr)] gap-4">
              <HabitsGridHeader displayDays={displayDays} />

              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  displayDays={displayDays}
                  monthlyScore={calculateMonthlyScore(habit.completedDays)}
                  onDelete={handleDeleteHabit}
                  onEdit={setEditingHabit}
                  onToggleDay={toggleHabitDay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!editingHabit} onOpenChange={() => setEditingHabit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'habitude</DialogTitle>
          </DialogHeader>
          <Input
            value={editingHabit?.name || ''}
            onChange={(e) => setEditingHabit(prev => prev ? { ...prev, name: e.target.value } : null)}
            placeholder="Nom de l'habitude"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingHabit(null)}>Annuler</Button>
            <Button onClick={handleEditHabit}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Habits;