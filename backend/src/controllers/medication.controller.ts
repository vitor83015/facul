import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// ===== Criar medicamento (apenas ADMIN) =====
export const createMedication = async (req: Request, res: Response) => {
  try {
    const {
      name,
      active,
      dosage,
      manufacturer,
      batch,
      expiration,
      stock,
      notes,
    } = req.body;
    const userId = (req as any).user?.id; // pegando id do usuário logado

    const medication = await prisma.medicine.create({
      data: {
        name,
        active,
        dosage,
        manufacturer,
        batch,
        expiration,
        stock: Number(stock) || 0,
        notes,
        createdBy: userId,
      },
    });

    res.status(201).json(medication);
  } catch (error) {
    console.error("Erro ao cadastrar medicamento:", error);
    res.status(500).json({ message: "Erro ao cadastrar medicamento", error });
  }
};


// ===== Buscar medicamento por ID =====
export const getMedicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medication = await prisma.medicine.findUnique({
      where: { id: Number(id) },
    });

    if (!medication) {
      return res.status(404).json({ message: "Medicamento não encontrado" });
    }

    res.json(medication);
  } catch (error) {
    console.error(`Erro ao buscar medicamento ${req.params.id}:`, error);
    res.status(500).json({ message: "Erro ao buscar medicamento", error });
  }
};

// ===== Listar todos medicamentos =====
export const listMedications = async (req: Request, res: Response) => {
  try {
    const medications = await prisma.medicine.findMany({
      include: { user: { select: { id: true, name: true, role: true } } },
    });

    res.json(medications);
  } catch (error) {
    console.error("Erro ao listar medicamentos:", error);
    res.status(500).json({ message: "Erro ao listar medicamentos", error });
  }
};

// ===== Atualizar medicamento (apenas ADMIN) =====
export const updateMedication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      active,
      dosage,
      manufacturer,
      batch,
      expiration,
      stock,
      notes,
    } = req.body;

    const medication = await prisma.medicine.update({
      where: { id: Number(id) },
      data: {
        name,
        active,
        dosage,
        manufacturer,
        batch,
        expiration,
        stock: Number(stock) || 0,
        notes,
      },
    });

    res.json(medication);
  } catch (error) {
    console.error("Erro ao atualizar medicamento:", error);
    res.status(500).json({ message: "Erro ao atualizar medicamento", error });
  }
};

// ===== Deletar medicamento (apenas ADMIN) =====
export const deleteMedication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.medicine.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Medicamento deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar medicamento:", error);
    res.status(500).json({ message: "Erro ao deletar medicamento", error });
  }
};
