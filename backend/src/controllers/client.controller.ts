import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";

// Tipagem para update
type UpdateClientData = {
  name?: string;
  email?: string;
  password?: string;
  cpf?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
};

// Criar cliente
export const registerClient = async (req: Request, res: Response) => {
  try {
    const { name, email, cpf, phone, address, city, state } = req.body;

    // Verifica se email ou CPF já existem
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { cpf }] },
    });
    if (existingUser)
      return res.status(400).json({ message: "Usuário já existe" });

    const client = await prisma.user.create({
      data: { name, email, cpf, phone, address, city, state, role: "CLIENT" },
    });

    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: "Erro ao cadastrar cliente", error: err });
  }
};

// Listar todos clientes
export const listClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.user.findMany({ where: { role: "CLIENT" } });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar clientes", error: err });
  }
};

// Buscar cliente por ID
export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!client)
      return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar cliente", error: err });
  }
};

// Atualizar cliente
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, cpf, phone, address, city, state } = req.body;

    const data: UpdateClientData = { name, email, cpf, phone, address, city, state };
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar cliente", error: err });
  }
};

// Deletar cliente
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Cliente deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar cliente", error: err });
  }
};
