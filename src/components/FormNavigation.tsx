import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NotesSheet } from "./NotesSheet";

export const FormNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center gap-4 mb-6">
        {location.pathname !== "/" && !isNotesOpen && (
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
          >
            Tasks
          </Button>
        )}
        {isNotesOpen && (
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
          >
            Tasks
          </Button>
        )}
        {location.pathname !== "/habits" && (
          <Button 
            variant="outline"
            onClick={() => navigate("/habits")}
          >
            Habits
          </Button>
        )}
        {!isNotesOpen && location.pathname !== "/settings" && (
          <Button 
            variant="outline"
            onClick={() => navigate("/settings")}
          >
            Settings
          </Button>
        )}
        {!isNotesOpen && (
          <Button
            variant="outline"
            onClick={() => setIsNotesOpen(true)}
          >
            Notes
          </Button>
        )}
        {isNotesOpen && (
          <Button 
            variant="outline"
            onClick={() => navigate("/settings")}
          >
            Settings
          </Button>
        )}
      </div>
      <NotesSheet isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </>
  );
};