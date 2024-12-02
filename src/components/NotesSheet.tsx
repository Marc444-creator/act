import { useState } from "react";
import { useStore } from "../store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormNavigation } from "./FormNavigation";
import { NoteForm } from "./notes/NoteForm";
import { NoteList } from "./notes/NoteList";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const NotesSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  
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
    setIsCreatingNote(false);
  };

  const handleNoteSelect = (noteId: string) => {
    const note = store.notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(note.id);
      setTitle(note.title);
      setContent(note.content);
      setSelectedProject(note.projectId);
      setSelectedNoteType(note.noteTypeId);
      setIsCreatingNote(true);
    }
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

  const handleNewNote = () => {
    setIsCreatingNote(true);
    resetForm();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Notes</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-hidden">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Notes</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Write down your ideas and link them to projects
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <FormNavigation />
          
          <div className="flex justify-between items-center mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by title..."
              className="flex-1 mr-2"
            />
            <Button onClick={handleNewNote} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 -mx-6 px-6">
            {isCreatingNote ? (
              <NoteForm
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                selectedNoteType={selectedNoteType}
                setSelectedNoteType={setSelectedNoteType}
                onSave={handleSave}
                isEditing={!!selectedNote}
              />
            ) : (
              filteredNotes.length > 0 && (
                <div>
                  <NoteList
                    notes={filteredNotes}
                    onNoteSelect={handleNoteSelect}
                    onDeleteNote={handleDeleteNote}
                  />
                </div>
              )
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};