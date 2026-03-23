import { useEffect, useState } from "react";
import ClientList from "../components/ClientList";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import {
  createTask,
  fetchClients,
  fetchTasksByClientId,
  updateTaskStatus,
} from "../services/dashboardService";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const loadTasksForClient = async (client) => {
    setSelectedClient(client);
    setIsTasksLoading(true);

    try {
      const taskResponse = await fetchTasksByClientId(client._id);
      setTasks(taskResponse.data || []);
    } catch {
      setTasks([]);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    if (!selectedClient) {
      return;
    }

    setIsCreatingTask(true);

    try {
      await createTask({
        ...formData,
        clientId: selectedClient._id,
        dueDate: new Date(formData.dueDate).toISOString(),
      });

      await loadTasksForClient(selectedClient);
      setIsFormVisible(false);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleMarkCompleted = async (task) => {
    if (task.status === "Completed") {
      return;
    }

    setUpdatingTaskId(task._id);

    try {
      const response = await updateTaskStatus(task._id, "Completed");
      const updatedTask = response.data;

      setTasks((previousTasks) =>
        previousTasks.map((previousTask) =>
          previousTask._id === updatedTask._id ? updatedTask : previousTask
        )
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientResponse = await fetchClients();
        const fetchedClients = clientResponse.data || [];

        setClients(fetchedClients);

        if (fetchedClients.length > 0) {
          await loadTasksForClient(fetchedClients[0]);
        }
      } catch {
        setClients([]);
        setTasks([]);
      }
    };

    loadClients();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="min-h-screen flex flex-col lg:flex-row">
        <ClientList
          clients={clients}
          selectedClient={selectedClient}
          onSelectClient={loadTasksForClient}
        />

        <section className="w-full lg:w-3/4 p-4 md:p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Compliance Tasks</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedClient
                    ? `Showing tasks for ${selectedClient.companyName || selectedClient.company_name}`
                    : "Select a client to view tasks"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFormVisible((previous) => !previous)}
                disabled={!selectedClient}
                className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
              >
                Add Task
              </button>
            </div>
          </div>

          {isFormVisible ? (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setIsFormVisible(false)}
              isSubmitting={isCreatingTask}
            />
          ) : null}

          <TaskList
            tasks={tasks}
            isLoading={isTasksLoading}
            onMarkCompleted={handleMarkCompleted}
            updatingTaskId={updatingTaskId}
          />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
