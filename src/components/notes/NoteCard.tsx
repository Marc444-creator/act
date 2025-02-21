
import { Note } from "@/types";
import { Button } from "../ui/button";
import { Trash2, Link } from "lucide-react";
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

  const handleUrlClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={() => onNoteSelect(note.id)}
      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 group"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
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

      {note.urls && note.urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {note.urls.map((url, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-2 py-1"
              onClick={(e) => handleUrlClick(e, url)}
            >
              <Link className="h-3 w-3" />
              <span className="text-xs truncate max-w-[200px]">{url}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
