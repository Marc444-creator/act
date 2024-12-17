import { TaskList } from "../components/TaskList";
import { FormNavigation } from "../components/FormNavigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { Folder, MapPin, Calendar } from "lucide-react";

const ForLater = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const store = useStore();

  // Check for tasks to move every minute
  useEffect(() => {
    store.checkAndMoveForLaterTasks(); // Initial check
    
    const interval = setInterval(() => {
      store.checkAndMoveForLaterTasks();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [store]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">For Later</h1>
          
          <div className="flex items-center gap-4">
            <Select
              value={selectedProject || "all"}
              onValueChange={(value) => setSelectedProject(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <SelectValue placeholder="Filter by project" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
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
              value={selectedContext || "all"}
              onValueChange={(value) => setSelectedContext(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <SelectValue placeholder="Filter by context" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contexts</SelectItem>
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
              value={sortOrder}
              onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Sort by date" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Earliest First</SelectItem>
                <SelectItem value="desc">Latest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TaskList 
          filterProject={selectedProject}
          filterContext={selectedContext}
          filterStatus={null}
          showCompleted={false}
          isForLater={true}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
};

export default ForLater;