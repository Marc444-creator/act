
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface DateSortFilterProps {
  value: "asc" | "desc";
  onChange: (value: "asc" | "desc") => void;
}

export const DateSortFilter = ({ value, onChange }: DateSortFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[60px] bg-black text-white border-white/10">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-black" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Earliest First</SelectItem>
        <SelectItem value="desc">Latest First</SelectItem>
      </SelectContent>
    </Select>
  );
};
