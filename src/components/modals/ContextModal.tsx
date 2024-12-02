import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContextModalProps {
  newContextName: string;
  setNewContextName: (name: string) => void;
  newContextColor: string;
  setNewContextColor: (color: string) => void;
  handleAddContext: (e: React.FormEvent) => void;
  setShowContextModal: (show: boolean) => void;
  title?: string;
  description?: string;
}

export const ContextModal = ({
  newContextName,
  setNewContextName,
  newContextColor,
  setNewContextColor,
  handleAddContext,
  setShowContextModal,
  title = "Add Context",
  description = "Create a new context with a name and color"
}: ContextModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <form onSubmit={handleAddContext} className="space-y-4">
          <Input
            type="text"
            value={newContextName}
            onChange={(e) => setNewContextName(e.target.value)}
            placeholder="Name"
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
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </div>
  );
};