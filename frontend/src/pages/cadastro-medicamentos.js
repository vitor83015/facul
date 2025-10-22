// frontend/src/pages/cadastroMedicamentos.js
import { createMedication, updateMedication, getMedicationById } from "../api/MedicationApi.js";

export async function renderCadastroMedicamentos(id = null) {
  const app = document.getElementById('app');
  if (!app) return console.error('Elemento #app não encontrado.');

  app.innerHTML = `
    <div class="page-container">
      <header class="page-header">
        <a href="#" title="Voltar" aria-label="Voltar" class="back-button">
          <i class="fas fa-arrow-left"></i>
        </a>
        <i class="fas fa-link page-header-icon"></i>
        <div class="header-text">
          <h1 class="page-title">${id ? 'Editar' : 'Cadastro'} de Medicamento</h1>
          <p class="page-subtitle">Sprint 3 – ${id ? 'Edite' : 'Cadastre'} medicamentos no estoque</p>
        </div>
      </header>

      <form class="form-card">
        <div class="form-grid">
          <div class="form-group" style="grid-column: 1 / -1;">
            <label for="nome">Nome do Medicamento *</label>
            <input type="text" id="nome" placeholder="Digite o nome do medicamento" required>
          </div>
          <div class="form-group">
            <label for="ativo">Princípio Ativo *</label>
            <input type="text" id="ativo" placeholder="Digite o princípio ativo" required>
          </div>
          <div class="form-group">
            <label for="dosagem">Dosagem *</label>
            <input type="text" id="dosagem" placeholder="Ex: 500mg" required>
          </div>
          <div class="form-group">
            <label for="fabricante">Fabricante *</label>
            <input type="text" id="fabricante" placeholder="Nome do fabricante" required>
          </div>
          <div class="form-group">
            <label for="lote">Lote</label>
            <input type="text" id="lote" placeholder="Número do lote">
          </div>
          <div class="form-group">
            <label for="validade">Validade *</label>
            <input type="text" id="validade" placeholder="dd/mm/aaaa" required>
          </div>
          <div class="form-group">
            <label for="estoque">Quantidade em Estoque *</label>
            <input type="number" id="estoque" value="0" min="0" required>
          </div>
          <div class="form-group" style="grid-column: 1 / -1; margin-top: 20px;">
            <label for="observacoes">Observações</label>
            <textarea id="observacoes" placeholder="Informações adicionais sobre o medicamento"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="secondary-button back-button">Cancelar</button>
          <button type="submit" class="primary-button">${id ? 'Salvar Alterações' : 'Salvar Medicamento'}</button>
        </div>
      </form>
    </div>
  `;

  const form = app.querySelector('form');

  // Botão de voltar
  app.querySelectorAll('.back-button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'lista-medicamentos' } }));
    });
  });

  // Se tiver id, buscar medicamento e preencher formulário
  if (id) {
    try {
      const token = localStorage.getItem('token');
      const med = await getMedicationById(id, token);

      app.querySelector('#nome').value = med.name;
      app.querySelector('#ativo').value = med.active;
      app.querySelector('#dosagem').value = med.dosage;
      app.querySelector('#fabricante').value = med.manufacturer;
      app.querySelector('#lote').value = med.batch;
      app.querySelector('#validade').value = med.expiration;
      app.querySelector('#estoque').value = med.stock;
      app.querySelector('#observacoes').value = med.notes;
    } catch (err) {
      console.error('Erro ao carregar medicamento:', err);
      alert('Não foi possível carregar os dados do medicamento para edição.');
    }
  }

  // Evento submit
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      name: app.querySelector('#nome').value,
      active: app.querySelector('#ativo').value,
      dosage: app.querySelector('#dosagem').value,
      manufacturer: app.querySelector('#fabricante').value,
      batch: app.querySelector('#lote').value,
      expiration: app.querySelector('#validade').value,
      stock: Number(app.querySelector('#estoque').value),
      notes: app.querySelector('#observacoes').value,
    };

    const token = localStorage.getItem('token');

    try {
      if (id) {
        await updateMedication(id, data, token);
        alert('Medicamento atualizado com sucesso!');
      } else {
        await createMedication(data, token);
        alert('Medicamento cadastrado com sucesso!');
      }

      form.reset();
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'lista-medicamentos' } }));
    } catch (err) {
      console.error('Erro ao salvar medicamento:', err);
      alert('Falha ao salvar medicamento.');
    }
  });
}
