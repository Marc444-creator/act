import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useNavigate } from "react-router-dom";
import { FormNavigation } from "../components/FormNavigation";
import { FilterBar } from "../components/filters/FilterBar";
import { SearchBar } from "../components/filters/SearchBar";

const Index = () => {
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterContext, setFilterContext] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const store = useStore();

  // Check for recurring tasks every minute
  useEffect(() => {
    const checkRecurringTasks = () => {
      store.generateRecurringTasks();
    };

    // Check immediately when component mounts
    checkRecurringTasks();

    // Set up interval to check every minute
    const interval = setInterval(checkRecurringTasks, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle swipe right
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const diffX = touch.clientX - startX;

      if (diffX > 100) {
        navigate("/settings");
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener(
      "touchend",
      () => {
        document.removeEventListener("touchmove", handleTouchMove);
      },
      { once: true }
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-8"
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-900">Tasks</h1>
        </div>

        <TaskForm />

        <FilterBar
          filterProject={filterProject}
          setFilterProject={setFilterProject}
          filterContext={filterContext}
          setFilterContext={setFilterContext}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
        />

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <TaskList
          filterProject={filterProject}
          filterContext={filterContext}
          filterStatus={filterStatus}
          showCompleted={showCompleted}
          sortOrder={sortOrder}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default Index;