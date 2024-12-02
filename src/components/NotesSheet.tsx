import { useState } from "react";
import { useStore } from "../store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { FormNavigation } from "./FormNavigation";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);
  
  const store = useStore();

  const filteredNotes = store.notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (selectedNote) {
      store.updateNote(selectedNote, content, title, selectedNoteType);
      toast.success("Note updated successfully!");
    } else {
      store.addNote({
        title,
        content,
        projectId: selectedProject,
        noteTypeId: selectedNoteType,
      });
      toast.success("Note added successfully!");
    }
    
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedProject(null);
    setSelectedNoteType(null);
    setSelectedNote(null);
  };

  const handleNoteSelect = (noteId: string) => {
    const note = store.notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(note.id);
      setTitle(note.title);
      setContent(note.content);
      setSelectedProject(note.projectId);
      setSelectedNoteType(note.noteTypeId);
    }
  };

  const handleNewNote = () => {
    resetForm();
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      store.deleteNote(noteId);
      toast.success("Note deleted successfully!");
      if (selectedNote === noteId) {
        resetForm();
      }
    }
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
          <FormNavigation />
          
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title..."
            className="mb-4"
          />

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleNewNote}
              className="text-sm"
            >
              New Note
            </Button>
            
            <div className="flex gap-2">
              <Select
                value={selectedNoteType || "none"}
                onValueChange={(value) =>
                  setSelectedNoteType(value === "none" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Note Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Type</SelectItem>
                  {store.noteTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
          </div>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="mb-2"
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[200px]"
          />

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              {selectedNote ? "Update" : "Save"}
            </Button>
          </div>

          {filteredNotes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Previous Notes</h3>
              <div className="space-y-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleNoteSelect(note.id)}
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
                        handleDeleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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