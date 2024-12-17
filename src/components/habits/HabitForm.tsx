import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";
import { Plus } from 'lucide-react';

export const HabitForm = () => {
  const [newHabitName, setNewHabitName] = useState('');
  const { addHabit } = useStore();

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      toast.error("Le nom de l'habitude ne peut pas être vide");
      return;
    }
    addHabit({ 
      name: newHabitName, 
      completedDays: {} 
    });
    setNewHabitName('');
    toast.success("Habitude ajoutée avec succès!");
  };

  return (
    <form onSubmit={handleAddHabit} className="flex items-center space-x-2">
      <Input
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        placeholder="Nom de l'habitude..."
        className="flex-grow"
      />
      <Button type="submit" variant="outline" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};