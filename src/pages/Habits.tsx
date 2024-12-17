import React, { useState } from 'react';
import { subDays } from 'date-fns';
import { toast } from "sonner";
import { FormNavigation } from "../components/FormNavigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "../store/useStore";
import { HabitForm } from "../components/habits/HabitForm";
import { HabitsHeader } from "../components/habits/HabitsHeader";
import { HabitsGrid } from "../components/habits/HabitsGrid";

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

  const today = new Date();
  const displayDays = [
    subDays(today, 2),
    subDays(today, 1),
    today
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-6">
          <HabitsHeader />
          
          <div className="bg-blue-100/80 p-4 rounded-lg">
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