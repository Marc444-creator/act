
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { Filter } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        className="flex-1 bg-white text-black placeholder:text-black/60"
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select
              value={filterNoteType || "all"}
              onValueChange={(value) => setFilterNoteType(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-10 p-0 justify-center bg-white">
                <Filter className="h-4 w-4 text-black" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all" className="text-black">All types</SelectItem>
                {store.noteTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="text-black">
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter by note type</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select
              value={filterProject || "all"}
              onValueChange={(value) => setFilterProject(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-10 p-0 justify-center bg-white">
                <Filter className="h-4 w-4 text-black" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all" className="text-black">All projects</SelectItem>
                {store.projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="text-black">
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter by project</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
