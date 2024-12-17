import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";
import { Plus, BellOff } from 'lucide-react';

export const HabitForm = () => {
  const [newHabitName, setNewHabitName] = useState('');
  const { addHabit, toggleReminders, remindersEnabled } = useStore();

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
      <Button 
        type="submit" 
        size="icon" 
        className="bg-[#9b87f5] hover:bg-[#8b77e5] text-white rounded-full h-8 w-8 flex items-center justify-center"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Input
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
        placeholder="Nom de l'habitude..."
        className="flex-grow"
      />
      <Button
        type="button"
        size="icon"
        variant={remindersEnabled ? "default" : "secondary"}
        onClick={() => toggleReminders()}
        className="h-8 w-8"
        title={remindersEnabled ? "Désactiver les rappels" : "Activer les rappels"}
      >
        <BellOff className="h-4 w-4" />
      </Button>
    </form>
  );
};