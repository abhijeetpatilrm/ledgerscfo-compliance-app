import mongoose from "mongoose";
import taskService from "../services/taskService.js";

const TASK_STATUSES = ["Pending", "Completed"];

const getTasksByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clientId",
        data: null,
      });
    }

    const tasks = await taskService.getTasksByClientId(clientId);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      data: null,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, dueDate, clientId, status } = req.body;

    if (!title || !dueDate || !clientId) {
      return res.status(400).json({
        success: false,
        message: "title, dueDate, and clientId are required",
        data: null,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clientId",
        data: null,
      });
    }

    if (status && !TASK_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Pending, Completed",
        data: null,
      });
    }

    const task = await taskService.createTask(req.body);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      data: null,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
        data: null,
      });
    }

    if (!status || !TASK_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status is required and must be Pending or Completed",
        data: null,
      });
    }

    const updatedTask = await taskService.updateTaskStatus(id, status);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task status",
      data: null,
    });
  }
};

export default {
  getTasksByClientId,
  createTask,
  updateTaskStatus,
};
