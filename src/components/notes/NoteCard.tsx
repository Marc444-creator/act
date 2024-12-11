import { Note } from "@/types";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface NoteCardProps {
  note: Note;
  onNoteSelect: (noteId: string) => void;
}

export const NoteCard = ({ note, onNoteSelect }: NoteCardProps) => {
  const store = useStore();

  const handleDeleteNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.deleteNote(note.id);
    toast.success("Note deleted successfully!");
  };

  return (
    <div
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
          onClick={handleDeleteNote}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};