import { useState } from "react";
import { useStore } from "../store/useStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

export const NotesSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const store = useStore();

  const handleSave = () => {
    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (selectedNote) {
      store.updateNote(selectedNote, content);
      toast.success("Note updated successfully!");
    } else {
      store.addNote({
        content,
        projectId: selectedProject,
      });
      toast.success("Note added successfully!");
    }
    
    setIsOpen(false);
    setContent("");
    setSelectedProject(null);
    setSelectedNote(null);
  };

  const handleNoteSelect = (noteId: string) => {
    const note = store.notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(note.id);
      setContent(note.content);
      setSelectedProject(note.projectId);
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setContent("");
    setSelectedProject(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Notes</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Notes</SheetTitle>
          <SheetDescription>
            Write down your ideas and link them to projects
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleNewNote}
              className="text-sm"
            >
              New Note
            </Button>
            
            <Select
              value={selectedProject || "none"}
              onValueChange={(value) =>
                setSelectedProject(value === "none" ? null : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {store.projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[200px]"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedNote ? "Update" : "Save"}
            </Button>
          </div>

          {store.notes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Previous Notes</h3>
              <div className="space-y-2">
                {store.notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleNoteSelect(note.id)}
                    className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm line-clamp-2">{note.content}</p>
                      {note.projectId && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{
                            backgroundColor:
                              store.projects.find((p) => p.id === note.projectId)
                                ?.color,
                          }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(note.updatedAt), "PPp")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};