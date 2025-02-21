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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Plus, Link, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface NoteFormProps {
  selectedNote?: Note;
  onBack?: () => void;
  onFormVisible?: (visible: boolean) => void;
}

export const NoteForm = ({ selectedNote, onBack, onFormVisible }: NoteFormProps) => {
  const [isFormVisible, setIsFormVisible] = useState(!!selectedNote);
  const [title, setTitle] = useState(selectedNote?.title || "");
  const [content, setContent] = useState(selectedNote?.content || "");
  const [currentUrl, setCurrentUrl] = useState("");
  const [urls, setUrls] = useState<string[]>(selectedNote?.urls || []);
  const [dates, setDates] = useState<Date[]>(selectedNote?.dates || []);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(
    selectedNote?.noteTypeId || null
  );
  const [selectedProject, setSelectedProject] = useState<string | null>(
    selectedNote?.projectId || null
  );

  const store = useStore();

  useEffect(() => {
    onFormVisible?.(isFormVisible);
  }, [isFormVisible, onFormVisible]);

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
      setCurrentUrl("");
      setDates([]);
      setSelectedNoteType(null);
      setSelectedProject(null);
      setIsFormVisible(false);
      toast.success("Note created successfully!");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateExists = dates.some(
      (d) => d.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );

    if (dateExists) {
      setDates(dates.filter(
        (d) => d.toISOString().split('T')[0] !== date.toISOString().split('T')[0]
      ));
    } else {
      setDates([...dates, date]);
    }
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    setDates(dates.filter(
      (date) => date.toISOString().split('T')[0] !== dateToRemove.toISOString().split('T')[0]
    ));
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleUrlClick = (url: string) => {
    if (isValidUrl(url)) {
      window.open(url, '_blank');
    }
  };

  const handleAddUrl = () => {
    if (!currentUrl.trim()) {
      return;
    }

    if (!isValidUrl(currentUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (urls.includes(currentUrl)) {
      toast.error("This URL already exists");
      return;
    }

    setUrls([...urls, currentUrl]);
    setCurrentUrl("");
    toast.success("URL added successfully!");
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove));
  };

  if (!isFormVisible && !selectedNote) {
    return (
      <Button 
        onClick={() => setIsFormVisible(true)}
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
          className="text-xl font-semibold"
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedNoteType || "none"}
          onValueChange={(value) => setSelectedNoteType(value === "none" ? null : value)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select note type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No type</SelectItem>
            {store.noteTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
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
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No project</SelectItem>
            {store.projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
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
            placeholder="Add URL"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
          />
          <Button 
            type="button"
            onClick={handleAddUrl}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {urls.length > 0 && (
          <div className="space-y-2">
            {urls.map((url, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-md group">
                <button
                  type="button"
                  onClick={() => handleUrlClick(url)}
                  className="flex-1 text-left text-blue-600 hover:underline overflow-hidden overflow-ellipsis whitespace-nowrap"
                >
                  {url}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveUrl(url)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Add Dates
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {dates.length > 0 && (
          <div className="space-y-2">
            {dates.map((date, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md group">
                <span>{format(date, 'PPP')}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDate(date)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
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
        className={`min-h-[42px] text-lg transition-all duration-200 focus:min-h-[200px] ${
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
