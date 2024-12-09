import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";

export const HabitForm = () => {
  const [newHabitName, setNewHabitName] = useState('');
  const { addHabit } = useStore();

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      toast.error("Le nom de l'habitude ne peut pas être vide");
      return;
    }
    addHabit({ name: newHabitName, completedDays: {} });
    setNewHabitName('');
    toast.success("Habitude ajoutée avec succès!");
  };

  return (
    <form onSubmit={handleAddHabit} className="flex gap-4">
      <Input
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        placeholder="Nouvelle habitude..."
        className="flex-1"
      />
      <Button type="submit">Ajouter</Button>
    </form>
  );
};