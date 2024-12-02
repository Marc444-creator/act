import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "../../store/useStore";
import { Note } from "../../types";

interface NoteListProps {
  notes: Note[];
  onNoteSelect: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NoteList = ({ notes, onNoteSelect, onDeleteNote }: NoteListProps) => {
  const store = useStore();

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onNoteSelect(note.id)}
          className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 relative group"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{note.title}</h4>
              <p className="text-sm line-clamp-2">{note.content}</p>
            </div>
            <div className="flex items-center gap-2">
              {note.noteTypeId && (
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      store.noteTypes.find((t) => t.id === note.noteTypeId)
                        ?.color,
                  }}
                />
              )}
              {note.projectId && (
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      store.projects.find((p) => p.id === note.projectId)
                        ?.color,
                  }}
                />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(note.updatedAt), "PPp")}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNote(note.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
    </div>
  );
};