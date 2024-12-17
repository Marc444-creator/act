import { Switch } from "@/components/ui/switch";

interface CompletedFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const CompletedFilter = ({ value, onChange }: CompletedFilterProps) => {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Switch
        checked={value}
        onCheckedChange={onChange}
        id="show-completed"
      />
      <label htmlFor="show-completed" className="text-sm text-gray-600">
        Show completed
      </label>
    </div>
  );
};