
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NoteUrlManagerProps {
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
}

export const NoteUrlManager = ({ urls, onUrlsChange }: NoteUrlManagerProps) => {
  const [currentUrl, setCurrentUrl] = useState("");

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

    onUrlsChange([...urls, currentUrl]);
    setCurrentUrl("");
    toast.success("URL added successfully!");
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    onUrlsChange(urls.filter(url => url !== urlToRemove));
  };

  return (
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
  );
};
