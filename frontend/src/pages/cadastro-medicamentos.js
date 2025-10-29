// frontend/src/pages/cadastroMedicamentos.js
import { createMedication, updateMedication, getMedicationById } from "../api/MedicationApi.js";

export async function renderCadastroMedicamentos(id = null) {
  const app = document.getElementById("app");
  if (!app) return console.error("Elemento #app não encontrado.");

  app.innerHTML = `
    <div class="container py-5 d-flex justify-content-center">
      <div class="card shadow-lg p-4 w-100" style="max-width: 800px;">
        <header class="d-flex align-items-center mb-4">
          <a href="#" title="Voltar" aria-label="Voltar" class="me-3 back-button text-decoration-none text-primary fs-5">
            <i class="fas fa-arrow-left"></i>
          </a>
          <div>
            <h2 class="fw-bold mb-1">${id ? "Editar" : "Cadastro"} de Medicamento</h2>
            <p class="text-muted mb-0">Sprint 3 – ${id ? "Edite" : "Cadastre"} medicamentos no estoque</p>
          </div>
        </header>

        <form class="row g-3">
          <div class="col-12">
            <label for="nome" class="form-label fw-semibold">Nome do Medicamento *</label>
            <input type="text" id="nome" class="form-control" placeholder="Digite o nome do medicamento" required>
          </div>

          <div class="col-md-6">
            <label for="ativo" class="form-label fw-semibold">Princípio Ativo *</label>
            <input type="text" id="ativo" class="form-control" placeholder="Digite o princípio ativo" required>
          </div>

          <div class="col-md-6">
            <label for="dosagem" class="form-label fw-semibold">Dosagem *</label>
            <input type="text" id="dosagem" class="form-control" placeholder="Ex: 500mg" required>
          </div>

          <div class="col-md-6">
            <label for="fabricante" class="form-label fw-semibold">Fabricante *</label>
            <input type="text" id="fabricante" class="form-control" placeholder="Nome do fabricante" required>
          </div>

          <div class="col-md-6">
            <label for="lote" class="form-label fw-semibold">Lote</label>
            <input type="text" id="lote" class="form-control" placeholder="Número do lote">
          </div>

          <div class="col-md-6">
            <label for="validade" class="form-label fw-semibold">Validade *</label>
            <input type="text" id="validade" class="form-control" placeholder="dd/mm/aaaa" required>
          </div>

          <div class="col-md-6">
            <label for="estoque" class="form-label fw-semibold">Quantidade em Estoque *</label>
            <input type="number" id="estoque" class="form-control" value="0" min="0" required>
          </div>

          <div class="col-12">
            <label for="observacoes" class="form-label fw-semibold">Observações</label>
            <textarea id="observacoes" class="form-control" placeholder="Informações adicionais sobre o medicamento"></textarea>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button type="button" class="btn btn-outline-secondary back-button">
              <i class="fas fa-arrow-left"></i> Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> ${id ? "Salvar Alterações" : "Salvar Medicamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = app.querySelector("form");

  // Botão de voltar
  app.querySelectorAll(".back-button").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("navigate", { detail: { page: "lista-medicamentos" } }));
    });
  });

  // Se tiver id, buscar medicamento e preencher formulário
  if (id) {
    try {
      const token = localStorage.getItem("token");
      const med = await getMedicationById(id, token);

      app.querySelector("#nome").value = med.name;
      app.querySelector("#ativo").value = med.active;
      app.querySelector("#dosagem").value = med.dosage;
      app.querySelector("#fabricante").value = med.manufacturer;
      app.querySelector("#lote").value = med.batch;
      app.querySelector("#validade").value = med.expiration;
      app.querySelector("#estoque").value = med.stock;
      app.querySelector("#observacoes").value = med.notes;
    } catch (err) {
      console.error("Erro ao carregar medicamento:", err);
      alert("Não foi possível carregar os dados do medicamento para edição.");
    }
  }

  // Evento submit
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      name: app.querySelector("#nome").value,
      active: app.querySelector("#ativo").value,
      dosage: app.querySelector("#dosagem").value,
      manufacturer: app.querySelector("#fabricante").value,
      batch: app.querySelector("#lote").value,
      expiration: app.querySelector("#validade").value,
      stock: Number(app.querySelector("#estoque").value),
      notes: app.querySelector("#observacoes").value,
    };

    const token = localStorage.getItem("token");

    try {
      if (id) {
        await updateMedication(id, data, token);
        alert("Medicamento atualizado com sucesso!");
      } else {
        await createMedication(data, token);
        alert("Medicamento cadastrado com sucesso!");
      }

      form.reset();
      window.dispatchEvent(new CustomEvent("navigate", { detail: { page: "lista-medicamentos" } }));
    } catch (err) {
      console.error("Erro ao salvar medicamento:", err);
      alert("Falha ao salvar medicamento.");
    }
  });
}
