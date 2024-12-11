import { Note } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

interface NoteListProps {
  onNoteSelect: (noteId: string) => void;
}

export const NoteList = ({ onNoteSelect }: NoteListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterNoteType, setFilterNoteType] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const store = useStore();

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent note selection when deleting
    store.deleteNote(noteId);
    toast.success("Note deleted successfully!");
  };

  const filteredNotes = store.notes
    .filter((note) => !filterNoteType || note.noteTypeId === filterNoteType)
    .filter((note) => !filterProject || note.projectId === filterProject)
    .filter(
      (note) =>
        searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-4">
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

      <div className="space-y-2">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note.id)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                {note.noteTypeId && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        store.noteTypes.find((t) => t.id === note.noteTypeId)?.color ||
                        "#gray",
                    }}
                  />
                )}
                {note.projectId && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        store.projects.find((p) => p.id === note.projectId)?.color ||
                        "#gray",
                    }}
                  />
                )}
                <h4 className="font-medium">{note.title}</h4>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
                onClick={(e) => handleDeleteNote(note.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};