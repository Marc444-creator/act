import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../../store/useStore";

interface ProjectSelectProps {
  selectedProject: string | null;
  setSelectedProject: (value: string | null) => void;
}

export const ProjectSelect = ({ selectedProject, setSelectedProject }: ProjectSelectProps) => {
  const store = useStore();
  
  return (
    <Select
      value={selectedProject || "none"}
      onValueChange={(value) =>
        setSelectedProject(value === "none" ? null : value)
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Project" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No Project</SelectItem>
        {store.projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};