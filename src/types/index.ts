export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  contextId: string | null;
  completed: boolean;
  createdAt: Date;
  status: string;
  deadline: Date | null;
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
  completedDays: {
    [key: string]: boolean; // Format: "YYYY-MM-DD"
  };
}