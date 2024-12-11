export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  contextId: string | null;
  completed: boolean;
  createdAt: Date;
  status: string;
  deadline: Date | null;
  isForLater: boolean;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    lastGenerated: Date;
    daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
    daysOfMonth?: number[]; // 1-31
    interval?: number; // For daily: every X days
  } | null;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Context {
  id: string;
  name: string;
  color: string;
}

export interface TaskStatus {
  id: string;
  name: string;
  color: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;  // Optional description field
  completedDays: {
    [key: string]: boolean; // Format: "YYYY-MM-DD"
  };
}

export interface NoteType {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  projectId: string | null;
  noteTypeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}