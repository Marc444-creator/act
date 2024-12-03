import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useStore } from "../../store/useStore";
import { toast } from "sonner";

interface ProjectSectionProps {
  onAddClick: () => void;
}

export const ProjectSection = ({ onAddClick }: ProjectSectionProps) => {
  const store = useStore();
  const sortedProjects = [...store.projects].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project? This will remove the project from all associated tasks.")) {
      store.deleteProject(projectId);
      toast.success("Project deleted successfully!");
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={onAddClick}>Add Project</Button>
      <div className="space-y-2">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg shadow group"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span>{project.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteProject(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};