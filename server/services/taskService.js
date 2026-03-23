import Task from "../models/Task.js";

const getTasksByClientId = async (clientId) => {
  return Task.find({ clientId }).populate("clientId").sort({ dueDate: 1 });
};

const createTask = async (taskData) => {
  return Task.create(taskData);
};

const updateTaskStatus = async (taskId, status) => {
  return Task.findByIdAndUpdate(
    taskId,
    { status },
    { returnDocument: "after", runValidators: true }
  );
};

export default {
  getTasksByClientId,
  createTask,
  updateTaskStatus,
};
