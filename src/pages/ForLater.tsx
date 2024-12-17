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

  useEffect(() => {
    store.checkAndMoveForLaterTasks(); // Initial check
    
    const interval = setInterval(() => {
      store.checkAndMoveForLaterTasks();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [store]);

  const projectsWithTasks = store.projects
    .map(project => ({
      ...project,
      taskCount: store.tasks.filter(task => 
        task.projectId === project.id && task.isForLater
      ).length
    }))
    .filter(project => project.taskCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const contextsWithTasks = store.contexts
    .map(context => ({
      ...context,
      taskCount: store.tasks.filter(task => 
        task.contextId === context.id && task.isForLater
      ).length
    }))
    .filter(context => context.taskCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 text-center">For Later</h1>
          
          <div className="flex items-center gap-4 bg-[#ea384c]/10 p-4 rounded-lg">
            <Select
              value={selectedProject || "none"}
              onValueChange={(value) => setSelectedProject(value === "none" ? null : value)}
            >
              <SelectTrigger className="w-[60px]">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Projects</SelectItem>
                {projectsWithTasks.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: project.taskCount === 1 ? '#4ade80' : '#ea384c'
                        }}
                      />
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedContext || "none"}
              onValueChange={(value) => setSelectedContext(value === "none" ? null : value)}
            >
              <SelectTrigger className="w-[60px]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Contexts</SelectItem>
                {contextsWithTasks.map((context) => (
                  <SelectItem key={context.id} value={context.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: context.taskCount === 1 ? '#4ade80' : '#ea384c'
                        }}
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
