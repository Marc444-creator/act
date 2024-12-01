import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotesSheet } from "./NotesSheet";

export const FormNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Button 
        variant="outline"
        onClick={() => navigate("/")}
      >
        Tasks
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate("/habits")}
      >
        Habits
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate("/settings")}
      >
        Settings
      </Button>
      <NotesSheet />
    </div>
  );
};