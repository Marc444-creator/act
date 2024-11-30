import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProjectModalProps {
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  newProjectColor: string;
  setNewProjectColor: (color: string) => void;
  handleAddProject: (e: React.FormEvent) => void;
  setShowProjectModal: (show: boolean) => void;
}

export const ProjectModal = ({
  newProjectName,
  setNewProjectName,
  newProjectColor,
  setNewProjectColor,
  handleAddProject,
  setShowProjectModal,
}: ProjectModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Project</h2>
        <form onSubmit={handleAddProject} className="space-y-4">
          <Input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name"
          />
          <Input
            type="color"
            value={newProjectColor}
            onChange={(e) => setNewProjectColor(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowProjectModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Project</Button>
          </div>
        </form>
      </div>
    </div>
  );
};