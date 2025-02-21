import { Note } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Link, X, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface NoteFormProps {
  selectedNote?: Note;
  onBack?: () => void;
  isFormVisible?: boolean;
  onFormVisible?: (visible: boolean) => void;
}

export const NoteForm = ({ 
  selectedNote, 
  onBack, 
  isFormVisible = false,
  onFormVisible 
}: NoteFormProps) => {
  const [title, setTitle] = useState(selectedNote?.title || "");
  const [content, setContent] = useState(selectedNote?.content || "");
  const [urls, setUrls] = useState<string[]>(selectedNote?.urls || []);
  const [dates, setDates] = useState<Date[]>(selectedNote?.dates || []);
  const [newUrl, setNewUrl] = useState("");
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(
    selectedNote?.noteTypeId || null
  );
  const [selectedProject, setSelectedProject] = useState<string | null>(
    selectedNote?.projectId || null
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const store = useStore();

  const handleAddUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      new URL(newUrl);
      setUrls([...urls, newUrl]);
      setNewUrl("");
    } catch (err) {
      toast.error("Please enter a valid URL");
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove));
  };

  const handleAddDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date.setHours(0, 0, 0, 0));
      if (!dates.some(d => d.getTime() === newDate.getTime())) {
        setDates([...dates, newDate]);
      }
      setIsCalendarOpen(false);
    }
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    setDates(dates.filter(date => date.getTime() !== dateToRemove.getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (selectedNote) {
      store.updateNote(selectedNote.id, { 
        content, 
        title, 
        noteTypeId: selectedNoteType,
        urls,
        dates
      });
      toast.success("Note updated successfully!");
      if (onBack) onBack();
    } else {
      store.addNote({
        title,
        content,
        noteTypeId: selectedNoteType,
        projectId: selectedProject,
        urls,
        dates,
      });
      setTitle("");
      setContent("");
      setUrls([]);
      setDates([]);
      setSelectedNoteType(null);
      setSelectedProject(null);
      if (onBack) onBack();
      toast.success("Note created successfully!");
    }
  };

  if (!isFormVisible && !selectedNote) {
    return (
      <Button 
        onClick={() => onFormVisible?.(true)}
        size="icon"
        className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          type="submit" 
          size="icon"
          className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold bg-white text-black placeholder:text-black/60"
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedNoteType || "none"}
          onValueChange={(value) => setSelectedNoteType(value === "none" ? null : value)}
        >
          <SelectTrigger className="flex-1 bg-white text-black">
            <SelectValue placeholder="Select note type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="none" className="text-black">No type</SelectItem>
            {store.noteTypes.map((type) => (
              <SelectItem key={type.id} value={type.id} className="text-black">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span>{type.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedProject || "none"}
          onValueChange={(value) => setSelectedProject(value === "none" ? null : value)}
        >
          <SelectTrigger className="flex-1 bg-white text-black">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="none" className="text-black">No project</SelectItem>
            {store.projects.map((project) => (
              <SelectItem key={project.id} value={project.id} className="text-black">
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
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Add URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl(e as unknown as React.MouseEvent);
              }
            }}
            className="bg-white text-black placeholder:text-black/60"
          />
          <Button 
            type="button"
            size="icon"
            variant="outline"
            className="shrink-0 bg-white text-black hover:bg-white/90 hover:text-black"
            onClick={handleAddUrl}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {urls.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white">
            {urls.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
              >
                <Link className="h-3 w-3 text-black" />
                <span className="text-sm truncate max-w-[200px] text-black">{url}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent text-black hover:text-black/90"
                  onClick={() => handleRemoveUrl(url)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="bg-white text-black hover:bg-white/90 hover:text-black"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={undefined}
                onSelect={handleAddDate}
                initialFocus
                className="bg-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {dates.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white">
            {dates.map((date, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
              >
                <Calendar className="h-3 w-3 text-black" />
                <span className="text-sm text-black">{format(date, 'PP')}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent text-black hover:text-black/90"
                  onClick={() => handleRemoveDate(date)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`min-h-[42px] text-lg transition-all duration-200 focus:min-h-[200px] bg-white text-black placeholder:text-black/60 ${
          selectedNote ? "focus:min-h-[calc(100vh-300px)]" : ""
        }`}
      />

      {selectedNote && (
        <Button type="submit" className="w-full">
          Update Note
        </Button>
      )}
    </form>
  );
};
