// frontend/src/pages/lista-medicamentos.js
import { getMedications, deleteMedication } from '../api/ClientApi.js';

export async function renderListaMedicamentos() {
  const app = document.getElementById('app');
  if (!app) return console.error("#app não encontrado");

  app.innerHTML = `
    <div class="page-container">
      <header class="page-header">
        <button class="back-button" title="Voltar para Home">
          <i class="fas fa-arrow-left"></i>
        </button>
        <i class="fas fa-capsules page-header-icon"></i>
        <div class="header-text">
          <h1 class="page-title">Medicamentos em Estoque</h1>
          <p class="page-subtitle">Visualize e gerencie o estoque de medicamentos</p>
        </div>
      </header>

      <input type="search" class="search-bar" placeholder="Buscar por medicamento, princípio ativo ou lote..." id="searchMedications">

      <section class="delivery-list" id="medications-container">
        <p>Carregando medicamentos...</p>
      </section>

      <div class="total-entregas" id="total-medications">
        Total de itens em estoque: 0
      </div>
    </div>
  `;

  const container = document.getElementById('medications-container');
  const totalEl = document.getElementById('total-medications');
  const searchInput = document.getElementById('searchMedications');

  // Botão voltar
  app.querySelector('.back-button').addEventListener('click', () =>
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))
  );

  async function loadMedications() {
    try {
      const medications = await getMedications();

      if (!medications.length) {
        container.innerHTML = "<p>Nenhum medicamento registrado.</p>";
        totalEl.textContent = "Total de itens em estoque: 0";
        return;
      }

      function renderList(list) {
        container.innerHTML = list.map(m => `
          <div class="delivery-item" style="grid-template-columns: 2fr 1fr;">
            <div class="delivery-info">
              <span class="client-name">${m.name}</span>
              <span class="med-info"><i class="fas fa-flask"></i> Princípio Ativo: ${m.active}</span>
              <span class="med-info"><i class="fas fa-industry"></i> Fabricante: ${m.manufacturer}</span>
            </div>
            <div class="delivery-info">
              <span class="client-info"><i class="fas fa-hashtag"></i> Lote: ${m.batch || '-'}</span>
              <span class="client-info" style="color: #28a745; font-weight: 600;">
                <i class="fas fa-warehouse"></i> Estoque: ${m.stock} und.
              </span>
              <div class="action-buttons" style="margin-top: 5px;">
                <button class="edit-btn" data-id="${m.id}"><i class="fas fa-edit"></i> Editar</button>
                <button class="delete-btn" data-id="${m.id}" style="margin-left: 5px;"><i class="fas fa-trash"></i> Deletar</button>
              </div>
            </div>
          </div>
        `).join('');

        totalEl.textContent = `Total de itens em estoque: ${list.length}`;
      }

      renderList(medications);

      // ===== Eventos de deletar =====
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          if (!confirm("Deseja realmente deletar este medicamento?")) return;
          try {
            await deleteMedication(id);
            alert("Medicamento deletado com sucesso!");
            loadMedications();
          } catch (err) {
            console.error("Erro ao deletar medicamento:", err);
            alert("Falha ao deletar medicamento.");
          }
        });
      });

      // ===== Eventos de editar =====
      container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'cadastro-medicamentos', id } }));
        });
      });

      // ===== Filtro simples =====
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        const filtered = medications.filter(m =>
          m.name.toLowerCase().includes(term) ||
          m.active.toLowerCase().includes(term) ||
          (m.batch || '').toLowerCase().includes(term)
        );
        renderList(filtered);
      });

    } catch (err) {
      console.error("Erro ao carregar medicamentos:", err);
      container.innerHTML = `<p>Falha ao carregar medicamentos: ${err.message}</p>`;
      totalEl.textContent = "Total de itens em estoque: 0";
    }
  }

  loadMedications();
}
