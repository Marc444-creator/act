import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#8B5CF6");
  const [newContextName, setNewContextName] = useState("");
  const [newContextColor, setNewContextColor] = useState("#D946EF");
  const navigate = useNavigate();
  const store = useStore();

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Tasks
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <Button onClick={() => setShowProjectModal(true)}>Add Project</Button>
            <div className="space-y-2">
              {store.projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg shadow"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contexts</h2>
            <Button onClick={() => setShowContextModal(true)}>Add Context</Button>
            <div className="space-y-2">
              {store.contexts.map((context) => (
                <div
                  key={context.id}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg shadow"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: context.color }}
                  />
                  <span>{context.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showProjectModal && (
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
        )}

        {showContextModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Add Context</h2>
              <form onSubmit={handleAddContext} className="space-y-4">
                <Input
                  type="text"
                  value={newContextName}
                  onChange={(e) => setNewContextName(e.target.value)}
                  placeholder="Context name"
                />
                <Input
                  type="color"
                  value={newContextColor}
                  onChange={(e) => setNewContextColor(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContextModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Context</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;