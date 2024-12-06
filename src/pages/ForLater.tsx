import { TaskList } from "../components/TaskList";
import { FormNavigation } from "../components/FormNavigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const ForLater = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">For Later</h1>
          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Earliest First</SelectItem>
              <SelectItem value="desc">Latest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TaskList 
          filterProject={null}
          filterContext={null}
          filterStatus={null}
          showCompleted={false}
          isForLater={true}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
};

export default ForLater;