import { Router } from "express";
import {
  createMedication,
  listMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
} from "../controllers/medication.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const router = Router();

// Listar todos medicamentos
router.get("/", protect, listMedications);

// Buscar por ID
router.get("/:id", protect, getMedicationById);

// Criar medicamento
router.post("/", protect, adminOnly, createMedication);

// Atualizar medicamento
router.put("/:id", protect, adminOnly, updateMedication);

// Deletar medicamento
router.delete("/:id", protect, adminOnly, deleteMedication);

export default router;
