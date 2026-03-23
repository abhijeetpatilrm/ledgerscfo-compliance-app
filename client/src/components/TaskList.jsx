import { CalendarDaysIcon, InboxIcon } from "./AppIcons";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

const TaskList = ({ tasks, isLoading, onMarkCompleted, updatingTaskId, emptyMessage = "No tasks found" }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-100" />
          <div className="h-4 w-52 rounded bg-gray-100" />
          <div className="h-9 w-28 rounded-lg bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <InboxIcon size={20} />
        </span>
        <p className="text-sm font-medium text-gray-700">{emptyMessage}</p>
        <p className="text-sm text-gray-500 mt-1">Try changing filters or add a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {tasks.map((task) => {
        const isOverdue = task.status === "Pending" && new Date(task.dueDate) < new Date();
        const priorityClassName =
          task.priority === "High"
            ? "bg-red-100 text-red-700"
            : task.priority === "Medium"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700";

        return (
          <article
            key={task._id}
            className={`rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 ease-out border-l-4 border-r border-t border-b ${
              isOverdue
                ? "bg-red-50/60 border-l-red-400 border-r-red-200 border-t-red-200 border-b-red-200"
                : "bg-white border-l-transparent border-r-gray-200 border-t-gray-200 border-b-gray-200"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.category || "Uncategorized"}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
                {task.priority ? (
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityClassName}`}
                  >
                    {task.priority}
                  </span>
                ) : null}
                {isOverdue ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Overdue
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <CalendarDaysIcon size={14} className="text-gray-500" />
                <span>
                  <span className="font-medium text-gray-700">Due Date:</span> {formatDate(task.dueDate)}
                </span>
              </p>

              {task.status === "Pending" ? (
                <button
                  type="button"
                  onClick={() => onMarkCompleted(task)}
                  disabled={updatingTaskId === task._id}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-60"
                >
                  {updatingTaskId === task._id ? "Updating..." : "Mark Completed"}
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TaskList;
