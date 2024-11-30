import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContextModalProps {
  newContextName: string;
  setNewContextName: (name: string) => void;
  newContextColor: string;
  setNewContextColor: (color: string) => void;
  handleAddContext: (e: React.FormEvent) => void;
  setShowContextModal: (show: boolean) => void;
}

export const ContextModal = ({
  newContextName,
  setNewContextName,
  newContextColor,
  setNewContextColor,
  handleAddContext,
  setShowContextModal,
}: ContextModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Context</h2>
        <form onSubmit={handleAddContext} className="space-y-4">
          <Input
            type="text"
            value={newContextName}
            onChange={(e) => setNewContextName(e.target.value)}
            placeholder="Context name"
          />
          <Input
            type="color"
            value={newContextColor}
            onChange={(e) => setNewContextColor(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowContextModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Context</Button>
          </div>
        </form>
      </div>
    </div>
  );
};