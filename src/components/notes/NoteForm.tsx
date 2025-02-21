
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
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

interface NoteFormProps {
  selectedNote?: Note;
  onBack?: () => void;
  onFormVisible?: (visible: boolean) => void;
}

export const NoteForm = ({ selectedNote, onBack, onFormVisible }: NoteFormProps) => {
  const [isFormVisible, setIsFormVisible] = useState(!!selectedNote);
  const [title, setTitle] = useState(selectedNote?.title || "");
  const [content, setContent] = useState(selectedNote?.content || "");
  const [urls, setUrls] = useState<string[]>(selectedNote?.urls || []);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(
    selectedNote?.noteTypeId || null
  );
  const [selectedProject, setSelectedProject] = useState<string | null>(
    selectedNote?.projectId || null
  );

  const store = useStore();

  useEffect(() => {
    onFormVisible?.(isFormVisible);
  }, [isFormVisible, onFormVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (selectedNote) {
      store.updateNote(selectedNote.id, { 
        content, 
        title, 
        noteTypeId: selectedNoteType,
        urls
      });
      toast.success("Note updated successfully!");
      if (onBack) onBack();
    } else {
      store.addNote({
        title,
        content,
        noteTypeId: selectedNoteType,
        projectId: selectedProject,
        urls,
      });
      setTitle("");
      setContent("");
      setUrls([]);
      setSelectedNoteType(null);
      setSelectedProject(null);
      setIsFormVisible(false);
      onFormVisible?.(false);
      toast.success("Note created successfully!");
    }
  };

  if (!isFormVisible && !selectedNote) {
    return (
      <Button 
        onClick={() => {
          setIsFormVisible(true);
          onFormVisible?.(true);
        }}
        size="icon"
        className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          type="submit" 
          size="icon"
          className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold"
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedNoteType || "none"}
          onValueChange={(value) => setSelectedNoteType(value === "none" ? null : value)}
        >
          <SelectTrigger className="flex-1">
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

        <Select
          value={selectedProject || "none"}
          onValueChange={(value) => setSelectedProject(value === "none" ? null : value)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No project</SelectItem>
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

      <Textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`min-h-[42px] text-lg transition-all duration-200 focus:min-h-[200px] ${
          selectedNote ? "focus:min-h-[calc(100vh-300px)]" : ""
        }`}
      />

      {selectedNote && (
        <Button type="submit" className="w-full">
          Update Note
        </Button>
      )}
    </form>
  );
};
