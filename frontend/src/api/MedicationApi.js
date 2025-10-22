// frontend/src/api/MedicationApi.js
const BASE_URL = "http://localhost:5000";

export async function createMedication(data, token) {
  try {
    const response = await fetch(`${BASE_URL}/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Erro ao cadastrar medicamento");
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao criar medicamento:", err);
    throw err;
  }
}

export async function getMedications(token) {
  try {
    const response = await fetch(`${BASE_URL}/medications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Erro ao listar medicamentos");
    }

    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar medicamentos:", err);
    throw err;
  }
}

// ===== Buscar medicamento por ID =====
export async function getMedicationById(id, token) {
  try {
    const response = await fetch(`${BASE_URL}/medications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Erro ao buscar medicamento");
    }

    return await response.json();
  } catch (err) {
    console.error(`Erro ao buscar medicamento ${id}:`, err);
    throw err;
  }
}

// ===== Atualizar medicamento =====
export async function updateMedication(id, data, token) {
  try {
    const response = await fetch(`${BASE_URL}/medications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Erro ao atualizar medicamento");
    }

    return await response.json();
  } catch (err) {
    console.error(`Erro ao atualizar medicamento ${id}:`, err);
    throw err;
  }
}

// ===== Deletar medicamento =====
export async function deleteMedication(id, token) {
  try {
    const response = await fetch(`${BASE_URL}/medications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Erro ao deletar medicamento");
    }

    return await response.json();
  } catch (err) {
    console.error(`Erro ao deletar medicamento ${id}:`, err);
    throw err;
  }
}
