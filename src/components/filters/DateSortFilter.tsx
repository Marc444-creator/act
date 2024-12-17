import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DateSortFilterProps {
  value: "asc" | "desc";
  onChange: (value: "asc" | "desc") => void;
}

export const DateSortFilter = ({ value, onChange }: DateSortFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className="w-8 h-8 p-0">
              <Calendar className="h-4 w-4" />
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sort by date</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SelectContent>
        <SelectItem value="asc">Earliest First</SelectItem>
        <SelectItem value="desc">Latest First</SelectItem>
      </SelectContent>
    </Select>
  );
};