import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// === Routes ===
import authRoutes from "./routes/auth.routes";
import medicationRoutes from "./routes/medication.routes";
import clientRoutes from "./routes/client.routes";
import deliveryRoutes from './routes/delivery.routes';

dotenv.config();

const app = express();

// === Middlewares ===
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// === Rotas ===
app.use("/clients", clientRoutes);
app.use("/auth", authRoutes);
app.use("/medications", medicationRoutes);
app.use("/deliveries", deliveryRoutes);

// === Rota raiz ===
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// === Servidor ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
