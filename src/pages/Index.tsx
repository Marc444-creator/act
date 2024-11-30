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

  // Sort projects and contexts alphabetically
  const sortedProjects = [...store.projects].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  const sortedContexts = [...store.contexts].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

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
              {sortedProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2 text-xs">
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
            onValueChange={(value) =>
              setFilterContext(value === "none" ? null : value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ctx" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Contexts</SelectItem>
              {sortedContexts.map((context) => (
                <SelectItem key={context.id} value={context.id}>
                  <div className="flex items-center gap-2 text-xs">
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