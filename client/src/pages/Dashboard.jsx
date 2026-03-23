import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  Clock3Icon,
  FilterIcon,
  ListTodoIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "../components/AppIcons";
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
  const [taskError, setTaskError] = useState("");
  const [clientsError, setClientsError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("nearest");

  const loadTasksForClient = async (client) => {
    setSelectedClient(client);
    setIsTasksLoading(true);
    setTaskError("");

    try {
      const taskResponse = await fetchTasksByClientId(client._id);
      setTasks(taskResponse.data || []);
    } catch {
      setTasks([]);
      setTaskError("Unable to load tasks right now.");
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    if (!selectedClient) {
      return false;
    }

    setIsCreatingTask(true);
    setTaskError("");

    try {
      await createTask({
        ...formData,
        clientId: selectedClient._id,
        dueDate: new Date(formData.dueDate).toISOString(),
      });

      await loadTasksForClient(selectedClient);
      setIsFormVisible(false);
      return true;
    } catch {
      setTaskError("Unable to create task. Please try again.");
      return false;
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleMarkCompleted = async (task) => {
    if (task.status === "Completed") {
      return;
    }

    setUpdatingTaskId(task._id);
    setTaskError("");

    try {
      const response = await updateTaskStatus(task._id, "Completed");
      const updatedTask = response.data;

      setTasks((previousTasks) =>
        previousTasks.map((previousTask) =>
          previousTask._id === updatedTask._id ? updatedTask : previousTask
        )
      );
    } catch {
      setTaskError("Unable to update task status.");
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

  const hasActiveFilters = statusFilter !== "All" || categoryFilter !== "All" || searchTerm.trim() !== "";

  const clearFilters = () => {
    setStatusFilter("All");
    setCategoryFilter("All");
    setSearchTerm("");
    setSortOrder("nearest");
  };

  useEffect(() => {
    const loadClients = async () => {
      setClientsError("");

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
        setClientsError("Unable to load clients. Please refresh.");
      }
    };

    loadClients();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      <div className="min-h-screen flex flex-col lg:flex-row">
        <ClientList
          clients={clients}
          selectedClient={selectedClient}
          onSelectClient={loadTasksForClient}
        />

        <section className="w-full lg:w-3/4 p-4 md:p-6 space-y-6">
          <header className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Compliance Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedClient
                    ? `${selectedClient.companyName || selectedClient.company_name || "Unnamed Client"}`
                    : "Select a client to view tasks"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFormVisible((previous) => !previous)}
                disabled={!selectedClient}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white shadow-sm hover:bg-gray-800 hover:shadow transition disabled:opacity-60"
              >
                Add Task
              </button>
            </div>
          </header>

          {clientsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {clientsError}
            </div>
          ) : null}

          {taskError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {taskError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total tasks</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{summary.total}</p>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600">
                  <ListTodoIcon size={18} />
                </span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-yellow-800/80">Pending tasks</p>
                  <p className="text-2xl font-semibold text-yellow-700 mt-1">{summary.pending}</p>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 border border-yellow-200 text-yellow-700">
                  <Clock3Icon size={18} />
                </span>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-red-800/80">Overdue tasks</p>
                  <p className="text-2xl font-semibold text-red-700 mt-1">{summary.overdue}</p>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 border border-red-200 text-red-700">
                  <AlertTriangleIcon size={18} />
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-2 flex items-center gap-1.5">
                  <FilterIcon size={13} />
                  Status
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {["All", "Pending", "Completed"].map((status) => {
                    const isActive = statusFilter === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition duration-200 ${
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
                <span className="text-xs font-semibold tracking-wide uppercase text-gray-500 flex items-center gap-1.5">
                  <FilterIcon size={13} />
                  Category
                </span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-gray-700">
                <span className="text-xs font-semibold tracking-wide uppercase text-gray-500 flex items-center gap-1.5">
                  <SearchIcon size={13} />
                  Search
                </span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by title"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
                />
              </label>

              <label className="text-sm text-gray-700">
                <span className="text-xs font-semibold tracking-wide uppercase text-gray-500 flex items-center gap-1.5">
                  <SlidersHorizontalIcon size={13} />
                  Sort by due date
                </span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
                >
                  <option value="nearest">Nearest first</option>
                  <option value="farthest">Farthest first</option>
                </select>
              </label>
            </div>

            {hasActiveFilters ? (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Clear filters
                </button>
              </div>
            ) : null}
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
            emptyMessage={hasActiveFilters ? "No tasks match the current filters" : "No tasks found"}
          />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
