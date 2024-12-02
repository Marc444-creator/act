import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useStore } from "../store/useStore";
import { Trash2 } from "lucide-react";
import { FormNavigation } from "../components/FormNavigation";
import { ProjectModal } from "../components/modals/ProjectModal";
import { ContextModal } from "../components/modals/ContextModal";

const Settings = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#8B5CF6");
  const [newContextName, setNewContextName] = useState("");
  const [newContextColor, setNewContextColor] = useState("#D946EF");
  const store = useStore();

  const sortedProjects = [...store.projects].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const sortedContexts = [...store.contexts].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    store.addProject({
      name: newProjectName,
      color: newProjectColor,
    });
    setNewProjectName("");
    setShowProjectModal(false);
    toast.success("Project added successfully!");
  };

  const handleAddContext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContextName.trim()) return;

    store.addContext({
      name: newContextName,
      color: newContextColor,
    });
    setNewContextName("");
    setShowContextModal(false);
    toast.success("Context added successfully!");
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project? This will remove the project from all associated tasks.")) {
      store.deleteProject(projectId);
      toast.success("Project deleted successfully!");
    }
  };

  const handleDeleteContext = (contextId: string) => {
    if (confirm("Are you sure you want to delete this context? This will remove the context from all associated tasks.")) {
      store.deleteContext(contextId);
      toast.success("Context deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <Button onClick={() => setShowProjectModal(true)}>Add Project</Button>
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

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contexts</h2>
            <Button onClick={() => setShowContextModal(true)}>Add Context</Button>
            <div className="space-y-2">
              {sortedContexts.map((context) => (
                <div
                  key={context.id}
                  className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg shadow group"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: context.color }}
                    />
                    <span>{context.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteContext(context.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showProjectModal && (
          <ProjectModal
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            newProjectColor={newProjectColor}
            setNewProjectColor={setNewProjectColor}
            handleAddProject={handleAddProject}
            setShowProjectModal={setShowProjectModal}
          />
        )}

        {showContextModal && (
          <ContextModal
            newContextName={newContextName}
            setNewContextName={setNewContextName}
            newContextColor={newContextColor}
            setNewContextColor={setNewContextColor}
            handleAddContext={handleAddContext}
            setShowContextModal={setShowContextModal}
          />
        )}
      </div>
    </div>
  );
};

export default Settings;