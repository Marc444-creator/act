import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";

interface NoteFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterNoteType: string | null;
  setFilterNoteType: (type: string | null) => void;
  filterProject: string | null;
  setFilterProject: (project: string | null) => void;
}

export const NoteFilters = ({
  searchQuery,
  setSearchQuery,
  filterNoteType,
  setFilterNoteType,
  filterProject,
  setFilterProject,
}: NoteFiltersProps) => {
  const store = useStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Select
        value={filterNoteType || "all"}
        onValueChange={(value) => setFilterNoteType(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {store.noteTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span>{type.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filterProject || "all"}
        onValueChange={(value) => setFilterProject(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          {store.projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span>{project.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};