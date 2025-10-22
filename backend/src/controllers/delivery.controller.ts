// backend/src/controllers/delivery.controller.ts
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// ================== LISTAR ENTREGAS ==================
export async function getAllDeliveries(req: Request, res: Response) {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: {
        client: true,
        medication: true,
      },
    });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar entregas', error: err });
  }
}

// ================== BUSCAR ENTREGA POR ID ==================
export async function getDeliveryById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: Number(id) },
      include: {
        client: true,
        medication: true,
      },
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Entrega não encontrada' });
    }

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar entrega', error: err });
  }
}

// ================== CRIAR ENTREGA ==================
export async function createDelivery(req: Request, res: Response) {
  const { clientId, medicationId, quantity, date, time, address, notes } = req.body;

  if (!clientId || !medicationId || !quantity || !date || !time || !address) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando' });
  }

  try {
    // Criar Date a partir de YYYY-MM-DD + HH:mm
    const dateTime = new Date(`${date}T${time}`);
    if (isNaN(dateTime.getTime())) {
      return res.status(400).json({ message: 'Data ou hora inválida' });
    }

    const delivery = await prisma.delivery.create({
      data: {
        clientId: Number(clientId),
        medicationId: Number(medicationId),
        quantity: Number(quantity),
        date: dateTime,
        time, // string HH:mm
        address,
        notes,
      },
      include: {
        client: true,
        medication: true,
      },
    });

    res.status(201).json(delivery);
  } catch (err) {
    console.error('Erro ao criar entrega:', err);
    res.status(500).json({ message: 'Erro ao criar entrega', error: err });
  }

}

// ================== ATUALIZAR ENTREGA ==================
export async function updateDelivery(req: Request, res: Response) {
  const { id } = req.params;
  const { clientId, medicationId, quantity, date, time, address, notes } = req.body;

  try {
    const updated = await prisma.delivery.update({
      where: { id: Number(id) },
      data: {
        clientId: Number(clientId),
        medicationId: Number(medicationId),
        quantity: Number(quantity),
        date,
        time,
        address,
        notes,
      },
      include: {
        client: true,
        medication: true,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar entrega', error: err });
  }
}

// ================== DELETAR ENTREGA ==================
export async function deleteDelivery(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.delivery.delete({ where: { id: Number(id) } });
    res.json({ message: 'Entrega deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar entrega', error: err });
  }
}
