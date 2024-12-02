import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NoteTypeSelect } from "./NoteTypeSelect";
import { ProjectSelect } from "./ProjectSelect";

interface NoteFormProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  selectedProject: string | null;
  setSelectedProject: (value: string | null) => void;
  selectedNoteType: string | null;
  setSelectedNoteType: (value: string | null) => void;
  onSave: () => void;
  isEditing: boolean;
}

export const NoteForm = ({
  title,
  setTitle,
  content,
  setContent,
  selectedProject,
  setSelectedProject,
  selectedNoteType,
  setSelectedNoteType,
  onSave,
  isEditing,
}: NoteFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <NoteTypeSelect
          selectedNoteType={selectedNoteType}
          setSelectedNoteType={setSelectedNoteType}
        />
        <ProjectSelect
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
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
        <Button onClick={onSave}>
          {isEditing ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};