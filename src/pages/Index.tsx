import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStore } from "../store/useStore";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { Switch } from "@/components/ui/switch";

const Index = () => {
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterContext, setFilterContext] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#8B5CF6");
  const [newContextName, setNewContextName] = useState("");
  const [newContextColor, setNewContextColor] = useState("#D946EF");

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
          <h1 className="text-4xl font-bold text-gray-900">Tasks</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setShowProjectModal(true)}>
              Add Project
            </Button>
            <Button variant="outline" onClick={() => setShowContextModal(true)}>
              Add Context
            </Button>
          </div>
        </div>

        <TaskForm />

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filterProject || "none"}
            onValueChange={(value) => setFilterProject(value === "none" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Projects</SelectItem>
              {store.projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterContext || "none"}
            onValueChange={(value) => setFilterContext(value === "none" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Contexts</SelectItem>
              {store.contexts.map((context) => (
                <SelectItem key={context.id} value={context.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: context.color }}
                    />
                    {context.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterStatus || "none"}
            onValueChange={(value) => setFilterStatus(value === "none" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Statuses</SelectItem>
              {store.statuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    {status.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
              id="show-completed"
            />
            <label htmlFor="show-completed" className="text-sm text-gray-600">
              Show completed tasks
            </label>
          </div>
        </div>

        <TaskList 
          filterProject={filterProject} 
          filterContext={filterContext} 
          filterStatus={filterStatus}
          showCompleted={showCompleted}
        />

        {/* Project Modal */}
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

        {/* Context Modal */}
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

export default Index;