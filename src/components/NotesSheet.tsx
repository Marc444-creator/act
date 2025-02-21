
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useStore } from "../store/useStore";
import { FormNavigation } from "./FormNavigation";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { NoteList } from "./notes/NoteList";
import { NoteForm } from "./notes/NoteForm";

export const NotesSheet = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const store = useStore();

  const handleNoteSelect = (noteId: string) => {
    setSelectedNote(noteId);
    setIsCreatingNote(false);
  };

  const handleBack = () => {
    setSelectedNote(null);
    setIsCreatingNote(false);
  };

  const selectedNoteData = selectedNote
    ? store.notes.find((n) => n.id === selectedNote)
    : undefined;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        className={`${selectedNote ? 'w-full max-w-full p-0' : 'w-[90%] sm:w-[540px]'} overflow-y-auto`}
      >
        {selectedNote ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <Button variant="ghost" onClick={handleBack}>
                <X className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h2 className="text-2xl font-bold">Edit Note</h2>
              <div className="w-[64px]" />
            </div>
            
            <div className="flex-1 p-6">
              <NoteForm selectedNote={selectedNoteData} onBack={handleBack} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <FormNavigation />
            <h2 className="text-2xl font-bold text-center">Notes</h2>
            
            <div className={isCreatingNote ? "space-y-4" : ""}>
              <NoteForm onFormVisible={(visible) => setIsCreatingNote(visible)} />
            </div>

            {!isCreatingNote && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Notes</h3>
                <NoteList onNoteSelect={handleNoteSelect} />
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
