import Client from "../models/Client.js";

const getAllClients = async () => {
  return Client.find().sort({ createdAt: -1 });
};

export default {
  getAllClients,
};
