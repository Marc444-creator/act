import { useState } from "react";
import { useStore } from "../store/useStore";
import { TaskItem } from "./TaskItem";
import { toast } from "sonner";

interface TaskListProps {
  filterProject: string | null;
  filterContext: string | null;
  filterStatus: string | null;
  showCompleted: boolean;
  isForLater?: boolean;
  sortOrder?: "asc" | "desc";
}

export const TaskList = ({ 
  filterProject, 
  filterContext, 
  filterStatus,
  showCompleted,
  isForLater = false,
  sortOrder = "asc"
}: TaskListProps) => {
  const store = useStore();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedProjectId, setEditedProjectId] = useState<string | null>(null);
  const [editedContextId, setEditedContextId] = useState<string | null>(null);
  const [editedDeadline, setEditedDeadline] = useState<Date | null>(null);

  const handleTaskClick = (task: any) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedProjectId(task.projectId);
    setEditedContextId(task.contextId);
    setEditedDeadline(task.deadline);
  };

  const handleEditSubmit = (taskId: string) => {
    if (editedTitle.trim()) {
      store.updateTask(taskId, {
        title: editedTitle.trim(),
        projectId: editedProjectId,
        contextId: editedContextId,
        deadline: editedDeadline,
      });
      toast.success("Task updated successfully!");
    }
    setEditingTaskId(null);
    setEditedTitle("");
    setEditedProjectId(null);
    setEditedContextId(null);
    setEditedDeadline(null);
  };

  let filteredTasks = store.tasks.filter((task) => {
    const matchesProject = !filterProject || task.projectId === filterProject;
    const matchesContext = !filterContext || task.contextId === filterContext;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesCompleted = showCompleted || !task.completed;
    const matchesForLater = task.isForLater === isForLater;

    return matchesProject && matchesContext && matchesStatus && matchesCompleted && matchesForLater;
  });

  if (isForLater && sortOrder) {
    filteredTasks.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return sortOrder === "asc" 
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    });
  }

  return (
    <div className="space-y-2">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editingTaskId={editingTaskId}
          editedTitle={editedTitle}
          editedProjectId={editedProjectId}
          editedContextId={editedContextId}
          editedDeadline={editedDeadline}
          onTaskClick={handleTaskClick}
          onEditSubmit={handleEditSubmit}
          setEditedTitle={setEditedTitle}
          setEditedProjectId={setEditedProjectId}
          setEditedContextId={setEditedContextId}
          setEditedDeadline={setEditedDeadline}
        />
      ))}
    </div>
  );
};