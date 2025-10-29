// frontend/src/api/ClientApi.js
const API_URL = "http://localhost:5000"; // endereço do backend
// ===== Função auxiliar para pegar headers com token =====
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não logado");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
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

// ================== CLIENTES ==================
export async function getClients() {
  return fetchJson(`${API_URL}/clients`, { headers: getAuthHeaders() });
}

export async function getClientById(id) {
  return fetchJson(`${API_URL}/clients/${id}`, { headers: getAuthHeaders() });
}

export async function createClient(clientData) {
  return fetchJson(`${API_URL}/clients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(clientData),
  });
}

export async function updateClient(id, clientData) {
  return fetchJson(`${API_URL}/clients/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(clientData),
  });
}

export async function deleteClient(id) {
  return fetchJson(`${API_URL}/clients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

// ================== MEDICAMENTOS ==================
export async function getMedications() {
  return fetchJson(`${API_URL}/medications`, { headers: getAuthHeaders() });
}

export async function getMedicationById(id) {
  return fetchJson(`${API_URL}/medications/${id}`, { headers: getAuthHeaders() });
}

export async function createMedication(medicationData) {
  return fetchJson(`${API_URL}/medications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(medicationData),
  });
}

export async function updateMedication(id, medicationData) {
  return fetchJson(`${API_URL}/medications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(medicationData),
  });
}

export async function deleteMedication(id) {
  return fetchJson(`${API_URL}/medications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

// ================== ENTREGAS ==================
export async function getDeliveries() {
  return fetchJson(`${API_URL}/deliveries`, { headers: getAuthHeaders() });
}

export async function getDeliveryById(id) {
  return fetchJson(`${API_URL}/deliveries/${id}`, { headers: getAuthHeaders() });
}

export async function createDelivery(deliveryData) {
  // Garantir que quantity seja número
  deliveryData.quantity = Number(deliveryData.quantity);

  // Garantir que date seja string "YYYY-MM-DD"
  if (deliveryData.date instanceof Date) {
    deliveryData.date = deliveryData.date.toISOString().split('T')[0];
  }

  return fetchJson(`${API_URL}/deliveries`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(deliveryData),
  });
}

export async function updateDelivery(id, deliveryData) {
  deliveryData.quantity = Number(deliveryData.quantity);

  if (deliveryData.date instanceof Date) {
    deliveryData.date = deliveryData.date.toISOString().split('T')[0];
  }

  return fetchJson(`${API_URL}/deliveries/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(deliveryData),
  });
}


export async function deleteDelivery(id) {
  return fetchJson(`${API_URL}/deliveries/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}
