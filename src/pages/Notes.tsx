import { useState } from "react";
import { FormNavigation } from "@/components/FormNavigation";
import { useStore } from "../store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Note } from "@/types";

export const Notes = () => {
  const store = useStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (selectedNote) {
      store.updateNote(selectedNote.id, {
        title,
        content,
        projectId,
      });
      toast.success("Note updated successfully!");
    } else {
      store.addNote({
        title,
        content,
        projectId,
      });
      toast.success("Note created successfully!");
    }

    setTitle("");
    setContent("");
    setProjectId(null);
    setSelectedNote(null);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setProjectId(note.projectId);
  };

  const sortedProjects = [...store.projects].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <FormNavigation />
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Select
            value={projectId || "none"}
            onValueChange={(value) => setProjectId(value === "none" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Project</SelectItem>
              {sortedProjects.map((project) => (
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

        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[200px]"
          />
        </div>

        <Button 
          type="submit"
          className="w-full md:w-auto px-8 py-2 text-base font-medium bg-primary hover:bg-primary/90 text-white"
        >
          {selectedNote ? "Update Note" : "Create Note"}
        </Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Notes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {store.notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNoteSelect(note)}
              className="p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{note.title}</h3>
                {note.projectId && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        store.projects.find((p) => p.id === note.projectId)
                          ?.color || "#8B5CF6",
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};