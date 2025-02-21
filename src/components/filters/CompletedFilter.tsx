
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckSquare } from "lucide-react";

interface CompletedFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const CompletedFilter = ({ value, onChange }: CompletedFilterProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Switch
              checked={value}
              onCheckedChange={onChange}
              id="show-completed"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Show completed tasks</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
