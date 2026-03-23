import api from "./api";

export const fetchClients = async () => {
  const response = await api.get("/clients");
  return response.data;
};

export const fetchTasksByClientId = async (clientId) => {
  const response = await api.get(`/tasks/${clientId}`);
  return response.data;
};

export const createTask = async (payload) => {
  const response = await api.post("/tasks", payload);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data;
};
