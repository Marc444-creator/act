import { useState } from "react";
import { useStore } from "@/store/useStore";
import { NoteFilters } from "./NoteFilters";
import { NoteCard } from "./NoteCard";

interface NoteListProps {
  onNoteSelect: (noteId: string) => void;
}

export const NoteList = ({ onNoteSelect }: NoteListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterNoteType, setFilterNoteType] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const store = useStore();

  const filteredNotes = store.notes
    .filter((note) => !filterNoteType || note.noteTypeId === filterNoteType)
    .filter((note) => !filterProject || note.projectId === filterProject)
    .filter(
      (note) =>
        searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <NoteFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterNoteType={filterNoteType}
        setFilterNoteType={setFilterNoteType}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
      />

      <div className="space-y-2">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onNoteSelect={onNoteSelect}
          />
        ))}
      </div>
    </div>
  );
};