// frontend/src/api/fetchWithToken.js
export async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não logado");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    // Tenta pegar mensagem de erro do backend
    let errMessage = "Erro desconhecido";
    try {
      const errData = await response.json();
      errMessage = errData.message || errMessage;
    } catch (e) {}
    throw new Error(errMessage);
  }

  return response.json();
}
