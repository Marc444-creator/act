
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskFormHeaderProps {
  title: string;
  setTitle: (title: string) => void;
}

export const TaskFormHeader = ({ title, setTitle }: TaskFormHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button type="submit" className="w-8 h-8 rounded-full p-0 shrink-0 text-sm bg-white text-black hover:bg-white/90 hover:text-black">+</Button>
      <Input
        placeholder="Add a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-white text-black placeholder:text-black/60"
      />
    </div>
  );
};
