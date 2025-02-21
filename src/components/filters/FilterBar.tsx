
import { ProjectFilter } from "./ProjectFilter";
import { ContextFilter } from "./ContextFilter";
import { DateSortFilter } from "./DateSortFilter";
import { CompletedFilter } from "./CompletedFilter";

interface FilterBarProps {
  filterProject: string | null;
  setFilterProject: (value: string | null) => void;
  filterContext: string | null;
  setFilterContext: (value: string | null) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
}

export const FilterBar = ({
  filterProject,
  setFilterProject,
  filterContext,
  setFilterContext,
  sortOrder,
  setSortOrder,
  showCompleted,
  setShowCompleted,
}: FilterBarProps) => {
  return (
    <div className="flex items-center gap-2 flex-nowrap overflow-x-auto bg-red-500 p-2 rounded-md">
      <ProjectFilter value={filterProject} onChange={setFilterProject} />
      <ContextFilter value={filterContext} onChange={setFilterContext} />
      <DateSortFilter value={sortOrder} onChange={setSortOrder} />
      <CompletedFilter value={showCompleted} onChange={setShowCompleted} />
    </div>
  );
};
