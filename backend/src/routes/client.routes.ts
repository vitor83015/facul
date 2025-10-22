import { Router } from "express";
import {
  registerClient,
  listClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/client.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", registerClient);
// router.get("/", protect, adminOnly, listClients);
router.get("/", listClients); // só pra teste
router.get("/:id", protect, adminOnly, getClientById);
router.put("/:id", protect, adminOnly, updateClient);
router.delete("/:id", protect, adminOnly, deleteClient);

export default router;
