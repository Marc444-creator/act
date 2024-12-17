import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Habit } from '../types';

type HabitStore = {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitDay: (habitId: string, date: string) => void;
  updateHabit: (habitId: string, name: string) => void;
};

export const useStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],
      addHabit: (habit) => {
        set((state) => ({
          habits: [
            ...state.habits, 
            { 
              ...habit, 
              id: uuidv4() 
            }
          ]
        }));
      },
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),
      toggleHabitDay: (habitId, date) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  completedDays: {
                    ...habit.completedDays,
                    [date]: !habit.completedDays[date],
                  },
                }
              : habit
          ),
        })),
      updateHabit: (id, name) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, name } : habit
          ),
        })),
    }),
    { name: 'habit-storage' }
  )
);
