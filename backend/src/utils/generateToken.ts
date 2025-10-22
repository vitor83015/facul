import jwt from "jsonwebtoken";

export const generateToken = (id: number, role: string) => {
  return jwt.sign(
    { id, role },              // payload
    process.env.JWT_SECRET!,   // chave secreta (colocar no .env)
    { expiresIn: "1d" }        // expira em 1 dia
  );
};
