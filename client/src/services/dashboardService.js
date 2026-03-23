import api from "./api";

const normalizeClient = (client) => ({
  ...client,
  companyName: client.companyName || client.company_name || "Unnamed Client",
  entityType: client.entityType || client.entity_type || "",
});

export const fetchClients = async () => {
  const response = await api.get("/clients");
  const payload = response.data;

  return {
    ...payload,
    data: Array.isArray(payload?.data)
      ? payload.data.map(normalizeClient)
      : [],
  };
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
