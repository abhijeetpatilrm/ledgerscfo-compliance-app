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

const TaskList = ({ tasks, isLoading, onMarkCompleted, updatingTaskId }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-gray-600">
        Loading tasks...
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-gray-600">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isOverdue = task.status === "Pending" && new Date(task.dueDate) < new Date();

        return (
          <article
            key={task._id}
            className={`rounded-lg shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition duration-200 ease-out border ${
              isOverdue ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
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
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Category:</span> {task.category || "-"}
              </p>
              <p>
                <span className="font-medium">Due Date:</span> {formatDate(task.dueDate)}
              </p>
            </div>

            <div className="mt-4">
              {task.status === "Pending" ? (
                <button
                  type="button"
                  onClick={() => onMarkCompleted(task)}
                  disabled={updatingTaskId === task._id}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
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
