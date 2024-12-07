import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../store/useStore";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { FormNavigation } from "../components/FormNavigation";

const Index = () => {
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterContext, setFilterContext] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();
  const store = useStore();

  // Get only projects that have tasks assigned
  const projectsWithTasks = store.projects.filter(project =>
    store.tasks.some(task => task.projectId === project.id)
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Get only contexts that have tasks assigned
  const contextsWithTasks = store.contexts.filter(context =>
    store.tasks.some(task => task.contextId === context.id)
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Calculate tasks per context
  const tasksPerContext = store.contexts.reduce((acc, context) => {
    const count = store.tasks.filter(task => 
      task.contextId === context.id && !task.completed
    ).length;
    acc[context.id] = count;
    return acc;
  }, {} as Record<string, number>);

  // Calculate tasks per project
  const tasksPerProject = store.projects.reduce((acc, project) => {
    const count = store.tasks.filter(task => 
      task.projectId === project.id && !task.completed
    ).length;
    acc[project.id] = count;
    return acc;
  }, {} as Record<string, number>);

  // Get dot color based on task count
  const getContextDotColor = (contextId: string) => {
    const count = tasksPerContext[contextId] || 0;
    if (count === 0) return '#22c55e'; // green
    if (count === 1) return '#FFD700'; // yellow
    return '#ef4444'; // red
  };

  // Get dot color based on project task count
  const getProjectDotColor = (projectId: string) => {
    const count = tasksPerProject[projectId] || 0;
    if (count === 0) return '#22c55e'; // green
    if (count === 1) return '#FFD700'; // yellow
    return '#ef4444'; // red
  };

  // Handle swipe right
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const diffX = touch.clientX - startX;

      if (diffX > 100) {
        navigate("/settings");
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener(
      "touchend",
      () => {
        document.removeEventListener("touchmove", handleTouchMove);
      },
      { once: true }
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-8"
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-900">Tasks</h1>
        </div>

        <TaskForm />

        {/* Filters */}
        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
          <Select
            value={filterProject || "none"}
            onValueChange={(value) =>
              setFilterProject(value === "none" ? null : value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Proj" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Projects</SelectItem>
              {projectsWithTasks.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getProjectDotColor(project.id) }}
                    />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterContext || "none"}
            onValueChange={(value) =>
              setFilterContext(value === "none" ? null : value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ctx" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Contexts</SelectItem>
              {contextsWithTasks.map((context) => (
                <SelectItem key={context.id} value={context.id}>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getContextDotColor(context.id) }}
                    />
                    {context.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Switch
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
              id="show-completed"
            />
            <label htmlFor="show-completed" className="text-sm text-gray-600">
              Show completed
            </label>
          </div>
        </div>

        <TaskList
          filterProject={filterProject}
          filterContext={filterContext}
          filterStatus={filterStatus}
          showCompleted={showCompleted}
        />
      </div>
    </div>
  );
};

export default Index;