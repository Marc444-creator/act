import { TaskList } from "../components/TaskList";
import { FormNavigation } from "../components/FormNavigation";

const ForLater = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FormNavigation />
        
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-gray-900">For Later</h1>
        </div>

        <TaskList 
          filterProject={null}
          filterContext={null}
          filterStatus={null}
          showCompleted={false}
          isForLater={true}
        />
      </div>
    </div>
  );
};

export default ForLater;