
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "../../store/useStore";
import { Folder } from "lucide-react";

interface ProjectFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const ProjectFilter = ({ value, onChange }: ProjectFilterProps) => {
  const store = useStore();

  return (
    <Select
      value={value || "none"}
      onValueChange={(value) => onChange(value === "none" ? null : value)}
    >
      <SelectTrigger className="w-[60px] bg-black text-white border-white/10">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-black" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">All Projects</SelectItem>
        {store.projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
