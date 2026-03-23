import clientService from "../services/clientService.js";

const getClients = async (_req, res) => {
  try {
    const clients = await clientService.getAllClients();

    return res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      data: clients,
    });
  } catch (error) {
    console.error("getClients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      data: null,
    });
  }
};

export default {
  getClients,
};
