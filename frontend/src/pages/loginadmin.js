// frontend/src/pages/loginAdmin.js
const BASE_URL = "http://localhost:3000";

export async function loginAdmin() {
  const email = "admin@teste.com";
  const password = "123456";

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Erro ao logar");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    console.log("Login bem-sucedido! Token salvo no localStorage.");
    alert("Login admin feito com sucesso!");
  } catch (err) {
    console.error("Erro ao logar admin:", err);
    alert("Falha ao logar admin. Veja console.");
  }
}
