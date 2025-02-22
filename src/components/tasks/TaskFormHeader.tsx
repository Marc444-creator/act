
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskFormHeaderProps {
  title: string;
  setTitle: (title: string) => void;
}

export const TaskFormHeader = ({ title, setTitle }: TaskFormHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        type="submit" 
        size="icon"
        className="bg-[#9b87f5] hover:bg-[#8b77e5] text-white rounded-full h-8 w-8 flex items-center justify-center"
      >
        +
      </Button>
      <Input
        placeholder="Add a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-white text-black placeholder:text-black/60"
      />
    </div>
  );
};
