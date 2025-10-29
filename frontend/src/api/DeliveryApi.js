// frontend/src/api/DeliveryApi.js
const API_URL = "http://localhost:5000"; // endereço do backend

// ===== Função auxiliar para pegar headers com token =====
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não logado");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

// ===== Função auxiliar para tratar fetch =====
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const data = await res.json();
      errorMessage = data.message || JSON.stringify(data);
    } catch (_) {
      const text = await res.text();
      if (text) errorMessage = text;
    }
    throw new Error(`Erro ${res.status}: ${errorMessage}`);
  }

  return await res.json();
}

// ================== ENTREGAS ==================

/**
 * Retorna todas as entregas registradas no sistema.
 */
export async function getDeliveries() {
  return fetchJson(`${API_URL}/deliveries`, { headers: getAuthHeaders() });
}

/**
 * Retorna uma entrega específica pelo ID.
 */
export async function getDeliveryById(id) {
  return fetchJson(`${API_URL}/deliveries/${id}`, { headers: getAuthHeaders() });
}

/**
 * Cria uma nova entrega.
 * Exemplo de deliveryData esperado:
 * {
 *   clientId: 1,
 *   medicationId: 2,
 *   quantity: 3,
 *   date: "2025-10-29",
 *   time: "14:30",
 *   address: "Rua Exemplo 123"
 * }
 */
export async function createDelivery(deliveryData) {
  // Garantir tipos corretos
  deliveryData.quantity = Number(deliveryData.quantity);

  if (deliveryData.date instanceof Date) {
    deliveryData.date = deliveryData.date.toISOString().split("T")[0];
  }

  return fetchJson(`${API_URL}/deliveries`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(deliveryData),
  });
}

/**
 * Atualiza uma entrega existente.
 */
export async function updateDelivery(id, deliveryData) {
  deliveryData.quantity = Number(deliveryData.quantity);

  if (deliveryData.date instanceof Date) {
    deliveryData.date = deliveryData.date.toISOString().split("T")[0];
  }

  return fetchJson(`${API_URL}/deliveries/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(deliveryData),
  });
}

/**
 * Deleta uma entrega pelo ID.
 */
export async function deleteDelivery(id) {
  return fetchJson(`${API_URL}/deliveries/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
