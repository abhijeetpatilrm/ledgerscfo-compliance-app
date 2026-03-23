import { useEffect, useMemo, useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("nearest");

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

  const categoryOptions = useMemo(() => {
    const categorySet = new Set(tasks.map((task) => task.category).filter(Boolean));
    return ["All", ...Array.from(categorySet)];
  }, [tasks]);

  const summary = useMemo(() => {
    const now = new Date();
    const pendingTasks = tasks.filter((task) => task.status === "Pending");
    const overdueTasks = pendingTasks.filter((task) => new Date(task.dueDate) < now);

    return {
      total: tasks.length,
      pending: pendingTasks.length,
      overdue: overdueTasks.length,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredTasks = tasks.filter((task) => {
      const statusMatch = statusFilter === "All" || task.status === statusFilter;
      const categoryMatch = categoryFilter === "All" || task.category === categoryFilter;
      const titleMatch =
        normalizedSearch.length === 0 ||
        (task.title || "").toLowerCase().includes(normalizedSearch);

      return statusMatch && categoryMatch && titleMatch;
    });

    return filteredTasks.sort((taskA, taskB) => {
      const firstDueDate = new Date(taskA.dueDate).getTime();
      const secondDueDate = new Date(taskB.dueDate).getTime();

      if (sortOrder === "farthest") {
        return secondDueDate - firstDueDate;
      }

      return firstDueDate - secondDueDate;
    });
  }, [tasks, statusFilter, categoryFilter, searchTerm, sortOrder]);

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
          <div className="mb-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Total tasks</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{summary.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Pending tasks</p>
              <p className="text-2xl font-semibold text-yellow-700 mt-1">{summary.pending}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Overdue tasks</p>
              <p className="text-2xl font-semibold text-red-700 mt-1">{summary.overdue}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {["All", "Pending", "Completed"].map((status) => {
                    const isActive = statusFilter === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-sm border transition ${
                          isActive
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="text-sm text-gray-700">
                <span className="font-medium">Category</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-gray-700">
                <span className="font-medium">Search</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by title"
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </label>

              <label className="text-sm text-gray-700">
                <span className="font-medium">Sort by due date</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                >
                  <option value="nearest">Nearest first</option>
                  <option value="farthest">Farthest first</option>
                </select>
              </label>
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
            tasks={visibleTasks}
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
