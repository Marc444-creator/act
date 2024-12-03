import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useStore } from "../../store/useStore";
import { toast } from "sonner";

interface NoteTypeSectionProps {
  onAddClick: () => void;
}

export const NoteTypeSection = ({ onAddClick }: NoteTypeSectionProps) => {
  const store = useStore();
  const sortedNoteTypes = [...store.noteTypes].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const handleDeleteNoteType = (noteTypeId: string) => {
    if (confirm("Are you sure you want to delete this note type? This will remove the type from all associated notes.")) {
      store.deleteNoteType(noteTypeId);
      toast.success("Note type deleted successfully!");
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={onAddClick}>Add Note Type</Button>
      <div className="space-y-2">
        {sortedNoteTypes.map((noteType) => (
          <div
            key={noteType.id}
            className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg shadow group"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: noteType.color }}
              />
              <span>{noteType.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteNoteType(noteType.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};