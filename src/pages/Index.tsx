import { useState } from "react";
import { useStore } from "../store/useStore";
import { Task } from "../types";
import { Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Index = () => {
  const [newTask, setNewTask] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterContext, setFilterContext] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#8B5CF6");
  const [newContextName, setNewContextName] = useState("");
  const [newContextColor, setNewContextColor] = useState("#D946EF");

  const store = useStore();

  const filteredTasks = store.tasks.filter((task) => {
    const matchesProject = !filterProject || task.projectId === filterProject;
    const matchesContext = !filterContext || task.contextId === filterContext;
    return matchesProject && matchesContext;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    store.addTask({
      title: newTask,
      projectId: selectedProject,
      contextId: selectedContext,
      completed: false,
    });
    setNewTask("");
    toast.success("Task added successfully!");
  };

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
            <Button
              variant="outline"
              onClick={() => setShowProjectModal(true)}
            >
              Add Project
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowContextModal(true)}
            >
              Add Context
            </Button>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Select
            value={selectedProject || ""}
            onValueChange={(value) => setSelectedProject(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Project</SelectItem>
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
            value={selectedContext || ""}
            onValueChange={(value) => setSelectedContext(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Context</SelectItem>
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
          <Button type="submit">
            <Plus className="w-4 h-4" />
          </Button>
        </form>

        {/* Filters */}
        <div className="flex gap-2">
          <Select
            value={filterProject || ""}
            onValueChange={(value) => setFilterProject(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
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
            value={filterContext || ""}
            onValueChange={(value) => setFilterContext(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Contexts</SelectItem>
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
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.toggleTask(task.id)}
              >
                {task.completed ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 border-2 rounded-full" />
                )}
              </Button>
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
              {task.projectId && (
                <Badge
                  style={{
                    backgroundColor:
                      store.projects.find((p) => p.id === task.projectId)
                        ?.color || "#8B5CF6",
                  }}
                >
                  {
                    store.projects.find((p) => p.id === task.projectId)
                      ?.name
                  }
                </Badge>
              )}
              {task.contextId && (
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor:
                      store.contexts.find((c) => c.id === task.contextId)
                        ?.color || "#D946EF",
                  }}
                >
                  {
                    store.contexts.find((c) => c.id === task.contextId)
                      ?.name
                  }
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => store.deleteTask(task.id)}
              >
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          ))}
        </div>

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