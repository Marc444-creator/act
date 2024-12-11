import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";

export const HabitForm = () => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const { addHabit } = useStore();

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      toast.error("Le nom de l'habitude ne peut pas être vide");
      return;
    }
    addHabit({ 
      name: newHabitName, 
      description: newHabitDescription.trim() || undefined, 
      completedDays: {} 
    });
    setNewHabitName('');
    setNewHabitDescription('');
    toast.success("Habitude ajoutée avec succès!");
  };

  return (
    <form onSubmit={handleAddHabit} className="space-y-4">
      <Input
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        placeholder="Nom de l'habitude..."
      />
      <Textarea
        value={newHabitDescription}
        onChange={(e) => setNewHabitDescription(e.target.value)}
        placeholder="Description de l'habitude (optionnel)..."
        className="min-h-[100px]"
      />
      <Button type="submit" className="w-full">Ajouter</Button>
    </form>
  );
};