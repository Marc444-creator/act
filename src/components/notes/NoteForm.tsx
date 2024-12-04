import { Note } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useState } from "react";

interface NoteFormProps {
  selectedNote?: Note;
  onBack?: () => void;
}

export const NoteForm = ({ selectedNote, onBack }: NoteFormProps) => {
  const [title, setTitle] = useState(selectedNote?.title || "");
  const [content, setContent] = useState(selectedNote?.content || "");
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(
    selectedNote?.noteTypeId || null
  );

  const store = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (selectedNote) {
      store.updateNote(selectedNote.id, content, title, selectedNoteType);
      toast.success("Note updated successfully!");
      if (onBack) onBack();
    } else {
      store.addNote({
        title,
        content,
        noteTypeId: selectedNoteType,
        projectId: null,
      });
      setTitle("");
      setContent("");
      setSelectedNoteType(null);
      toast.success("Note created successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-semibold"
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
        className={`min-h-[200px] text-lg ${
          selectedNote ? "min-h-[calc(100vh-300px)]" : ""
        }`}
      />

      <Button type="submit" className="w-full">
        {selectedNote ? "Update Note" : "Create Note"}
      </Button>
    </form>
  );
};