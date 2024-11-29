import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "../store/useStore";
import { format, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const Habits = () => {
  const [newHabitName, setNewHabitName] = useState('');
  const { habits, addHabit, deleteHabit, toggleHabitDay } = useStore();

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

  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h1 className="text-3xl font-bold">Mes Habitudes</h1>
          
          <form onSubmit={handleAddHabit} className="flex gap-4">
            <Input
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Nouvelle habitude..."
              className="flex-1"
            />
            <Button type="submit">Ajouter</Button>
          </form>

          <div className="mt-8">
            <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-4">
              <div className="font-semibold">Habitude</div>
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="text-center font-semibold">
                  {format(day, 'EEE', { locale: fr })}
                  <div className="text-sm text-gray-500">
                    {format(day, 'd MMM')}
                  </div>
                </div>
              ))}

              {habits.map((habit) => (
                <React.Fragment key={habit.id}>
                  <div className="flex items-center justify-between pr-4">
                    <span>{habit.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6"
                      onClick={() => {
                        deleteHabit(habit.id);
                        toast.success("Habitude supprimée!");
                      }}
                    >
                      <span className="sr-only">Supprimer</span>
                      ×
                    </Button>
                  </div>
                  {weekDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    return (
                      <div key={dateStr} className="flex justify-center items-center">
                        <Checkbox
                          checked={habit.completedDays[dateStr] || false}
                          onCheckedChange={() => toggleHabitDay(habit.id, dateStr)}
                        />
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Habits;