
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../store/useStore";
import { FormNavigation } from "../components/FormNavigation";
import { ProjectModal } from "../components/modals/ProjectModal";
import { ContextModal } from "../components/modals/ContextModal";
import { ProjectSection } from "../components/settings/ProjectSection";
import { ContextSection } from "../components/settings/ContextSection";
import { NoteTypeSection } from "../components/settings/NoteTypeSection";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [showNoteTypeModal, setShowNoteTypeModal] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showContexts, setShowContexts] = useState(false);
  const [showNoteTypes, setShowNoteTypes] = useState(false);
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
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-white">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 bg-black/50 p-3 rounded-lg shadow border border-white/10">
              <h2 className="text-xl font-semibold">Projects</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProjectModal(true)}
                  className="text-white hover:text-white/90"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProjects(!showProjects)}
                  className="text-white hover:text-white/90"
                >
                  {showProjects ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            {showProjects && <ProjectSection onAddClick={() => setShowProjectModal(true)} />}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 bg-black/50 p-3 rounded-lg shadow border border-white/10">
              <h2 className="text-xl font-semibold">Contexts</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowContextModal(true)}
                  className="text-white hover:text-white/90"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowContexts(!showContexts)}
                  className="text-white hover:text-white/90"
                >
                  {showContexts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            {showContexts && <ContextSection onAddClick={() => setShowContextModal(true)} />}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 bg-black/50 p-3 rounded-lg shadow border border-white/10">
              <h2 className="text-xl font-semibold">Note Types</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNoteTypeModal(true)}
                  className="text-white hover:text-white/90"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNoteTypes(!showNoteTypes)}
                  className="text-white hover:text-white/90"
                >
                  {showNoteTypes ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            {showNoteTypes && <NoteTypeSection onAddClick={() => setShowNoteTypeModal(true)} />}
          </div>
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
