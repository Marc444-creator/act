export interface Habit {
  id: string;
  name: string;
  description?: string;  // Optional description field
  completedDays: {
    [key: string]: boolean; // Format: "YYYY-MM-DD"
  };
}