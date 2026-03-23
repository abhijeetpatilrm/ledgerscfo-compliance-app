import { Router } from "express";
import taskController from "../controllers/taskController.js";

const router = Router();

router.get("/:clientId", taskController.getTasksByClientId);
router.post("/", taskController.createTask);
router.patch("/:id/status", taskController.updateTaskStatus);

export default router;
