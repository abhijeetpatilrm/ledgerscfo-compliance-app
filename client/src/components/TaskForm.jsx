import { useState } from "react";

const initialFormData = {
  title: "",
  category: "",
  dueDate: "",
  priority: "",
  description: "",
};

const TaskForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const didSucceed = await onSubmit(formData);

    if (didSucceed) {
      setFormData(initialFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create task</h3>
        <p className="text-sm text-gray-500 mt-1">Add a compliance task for the selected client.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm text-gray-700">
          <span className="font-medium">Title *</span>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
          />
        </label>

        <label className="text-sm text-gray-700">
          <span className="font-medium">Category</span>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
          />
        </label>

        <label className="text-sm text-gray-700">
          <span className="font-medium">Due Date *</span>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
          />
        </label>

        <label className="text-sm text-gray-700">
          <span className="font-medium">Priority</span>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
          >
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="text-sm text-gray-700 md:col-span-2">
          <span className="font-medium">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-500"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white shadow-sm hover:bg-gray-800 hover:shadow transition disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
