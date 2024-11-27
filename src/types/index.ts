export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  contextId: string | null;
  completed: boolean;
  createdAt: Date;
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