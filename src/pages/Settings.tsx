import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../store/useStore";
import { FormNavigation } from "../components/FormNavigation";
import { ProjectModal } from "../components/modals/ProjectModal";
import { ContextModal } from "../components/modals/ContextModal";
import { ProjectSection } from "../components/settings/ProjectSection";
import { ContextSection } from "../components/settings/ContextSection";
import { NoteTypeSection } from "../components/settings/NoteTypeSection";

const Settings = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [showNoteTypeModal, setShowNoteTypeModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#8B5CF6");
  const [newContextName, setNewContextName] = useState("");
  const [newContextColor, setNewContextColor] = useState("#D946EF");
  const [newNoteTypeName, setNewNoteTypeName] = useState("");
  const [newNoteTypeColor, setNewNoteTypeColor] = useState("#10B981");
  
  const store = useStore();

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    store.addProject({
      name: newProjectName,
      color: newProjectColor,
    });
    setNewProjectName("");
    setShowProjectModal(false);
    toast.success("Project added successfully!");
  };

  const handleAddContext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContextName.trim()) return;

    store.addContext({
      name: newContextName,
      color: newContextColor,
    });
    setNewContextName("");
    setShowContextModal(false);
    toast.success("Context added successfully!");
  };

  const handleAddNoteType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTypeName.trim()) return;

    store.addNoteType({
      name: newNoteTypeName,
      color: newNoteTypeColor,
    });
    setNewNoteTypeName("");
    setShowNoteTypeModal(false);
    toast.success("Note type added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProjectSection onAddClick={() => setShowProjectModal(true)} />
          <ContextSection onAddClick={() => setShowContextModal(true)} />
          <NoteTypeSection onAddClick={() => setShowNoteTypeModal(true)} />
        </div>

        {showProjectModal && (
          <ProjectModal
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            newProjectColor={newProjectColor}
            setNewProjectColor={setNewProjectColor}
            handleAddProject={handleAddProject}
            setShowProjectModal={setShowProjectModal}
          />
        )}

        {showContextModal && (
          <ContextModal
            newContextName={newContextName}
            setNewContextName={setNewContextName}
            newContextColor={newContextColor}
            setNewContextColor={setNewContextColor}
            handleAddContext={handleAddContext}
            setShowContextModal={setShowContextModal}
          />
        )}

        {showNoteTypeModal && (
          <ContextModal
            newContextName={newNoteTypeName}
            setNewContextName={setNewNoteTypeName}
            newContextColor={newNoteTypeColor}
            setNewContextColor={setNewNoteTypeColor}
            handleAddContext={handleAddNoteType}
            setShowContextModal={setShowNoteTypeModal}
            title="Add Note Type"
            description="Create a new note type with a name and color"
          />
        )}
      </div>
    </div>
  );
};

export default Settings;