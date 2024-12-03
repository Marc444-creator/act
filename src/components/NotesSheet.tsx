import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useStore } from "../store/useStore";
import { FormNavigation } from "./FormNavigation";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const NotesSheet = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);
  const [filterNoteType, setFilterNoteType] = useState<string | null>(null);
  
  const store = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (selectedNote) {
      store.updateNote(selectedNote, content, title, selectedNoteType);
      toast.success("Note updated successfully!");
    } else {
      store.addNote({
        title,
        content,
        noteTypeId: selectedNoteType,
        projectId: null,
      });
      toast.success("Note created successfully!");
    }

    setTitle("");
    setContent("");
    setSelectedNoteType(null);
    setSelectedNote(null);
  };

  const handleNoteSelect = (noteId: string) => {
    const note = store.notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(noteId);
      setTitle(note.title);
      setContent(note.content);
      setSelectedNoteType(note.noteTypeId);
    }
  };

  const filteredNotes = store.notes.filter(
    (note) => !filterNoteType || note.noteTypeId === filterNoteType
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] sm:w-[540px] overflow-y-auto">
        <div className="space-y-6">
          <FormNavigation />
          <h2 className="text-2xl font-bold text-center">Notes</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
            
            <Select
              value={selectedNoteType || "none"}
              onValueChange={(value) => setSelectedNoteType(value === "none" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No type</SelectItem>
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

            <Textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />

            <Button type="submit" className="w-full">
              {selectedNote ? "Update Note" : "Create Note"}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Notes</h3>
              <Select
                value={filterNoteType || "all"}
                onValueChange={(value) => setFilterNoteType(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[180px]">
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
            </div>
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleNoteSelect(note.id)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {note.noteTypeId && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          store.noteTypes.find((t) => t.id === note.noteTypeId)?.color ||
                          "#gray",
                      }}
                    />
                  )}
                  <h4 className="font-medium">{note.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};