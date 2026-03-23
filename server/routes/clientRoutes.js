import { Router } from "express";
import clientController from "../controllers/clientController.js";

const router = Router();

router.get("/", clientController.getClients);

export default router;
