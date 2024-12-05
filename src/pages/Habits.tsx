import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "../store/useStore";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FormNavigation } from "../components/FormNavigation";
import { Trash2, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Habits = () => {
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState<{ id: string; name: string } | null>(null);
  const { habits, addHabit, deleteHabit, toggleHabitDay, updateHabit } = useStore();

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
    
    const completedCount = daysInMonth.reduce((count, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return completedDays[dateStr] ? count + 1 : count;
    }, 0);

    return completedCount;
  };

  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
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
            <div className="grid grid-cols-[200px_80px_repeat(7,1fr)] gap-4">
              <div className="font-semibold">Habitude</div>
              <div className="font-semibold text-center">Score</div>
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
                  <div 
                    className="flex items-center justify-between pr-4 cursor-pointer hover:bg-gray-50 rounded-md"
                    onClick={() => setEditingHabit({ id: habit.id, name: habit.name })}
                  >
                    <span>{habit.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHabit(habit.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center font-semibold text-blue-600">
                    {calculateMonthlyScore(habit.completedDays)}
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