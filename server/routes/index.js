import { Router } from "express";
import clientRoutes from "./clientRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send("API is running");
});

router.use("/clients", clientRoutes);
router.use("/tasks", taskRoutes);

export default router;
