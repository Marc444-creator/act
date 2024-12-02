import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "../../store/useStore";

interface NoteTypeSelectProps {
  selectedNoteType: string | null;
  setSelectedNoteType: (value: string | null) => void;
}

export const NoteTypeSelect = ({ selectedNoteType, setSelectedNoteType }: NoteTypeSelectProps) => {
  const store = useStore();
  
  return (
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
  );
};