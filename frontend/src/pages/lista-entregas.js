// frontend/src/pages/lista-entregas.js
import { getDeliveries, deleteDelivery } from '../api/DeliveryApi.js';

export async function renderListaEntregas() {
  const app = document.getElementById('app');
  if (!app) return console.error("#app não encontrado");

  app.innerHTML = `
    <div class="page-container">
      <header class="page-header">
        <button class="back-button" title="Voltar para Listas">
          <i class="fas fa-arrow-left"></i>
        </button>
        <i class="fas fa-list-ul page-header-icon"></i>
        <div class="header-text">
          <h1 class="page-title">Lista de Entregas</h1>
          <p class="page-subtitle">Visualize todas as entregas registradas</p>
        </div>
      </header>

      <input type="search" class="search-bar" placeholder="Buscar por cliente ou medicamento..." id="searchDeliveries">

      <section class="delivery-list" id="deliveries-container">
        <p>Carregando entregas...</p>
      </section>

      <div class="total-entregas" id="total-deliveries">Total de entregas: 0</div>
    </div>
  `;

  const container = document.getElementById('deliveries-container');
  const totalEl = document.getElementById('total-deliveries');
  const searchInput = document.getElementById('searchDeliveries');

  // Botão voltar
  app.querySelector('.back-button').addEventListener('click', () =>
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'listas-hub' }))
  );

  async function loadDeliveries() {
    try {
      const deliveries = await getDeliveries();

      if (!deliveries.length) {
        container.innerHTML = "<p>Nenhuma entrega registrada.</p>";
        totalEl.textContent = "Total de entregas: 0";
        return;
      }

      function renderList(list) {
        container.innerHTML = '';
        list.forEach(d => {
          const clientName = d.client?.name || "Cliente desconhecido";
          const medName = d.medication?.name || "Medicamento não informado";
          const dateFormatted = d.date ? new Date(d.date).toLocaleDateString('pt-BR') : "Data não informada";
          const timeFormatted = d.time || "Horário não informado";

          const div = document.createElement('div');
          div.classList.add('delivery-item');
          div.innerHTML = `
            <div class="delivery-info">
              <span class="client-name">${clientName} <span style="font-weight: 400; font-size: 0.8rem;">(ID: #${d.id})</span></span>
              <span class="med-info"><i class="fas fa-capsules"></i> ${medName} - ${d.quantity || '?'}x</span>
              <span class="client-info"><i class="fas fa-map-marker-alt"></i> ${d.address || 'Endereço não informado'}</span>
            </div>
            <div class="delivery-info">
              <span class="client-info"><i class="fas fa-calendar-alt"></i> ${dateFormatted}</span>
              <span class="client-info"><i class="fas fa-clock"></i> ${timeFormatted}</span>
            </div>
            <div class="delivery-actions">
              <button class="edit-btn" data-id="${d.id}">Editar</button>
              <button class="delete-btn" data-id="${d.id}">Deletar</button>
            </div>
          `;
          container.appendChild(div);
        });

        totalEl.textContent = `Total de entregas: ${list.length}`;
      }

      renderList(deliveries);

      // Eventos
      container.addEventListener('click', async e => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('delete-btn')) {
          if (!confirm("Deseja realmente deletar esta entrega?")) return;
          try {
            await deleteDelivery(id);
            loadDeliveries();
          } catch (err) {
            console.error("Erro ao deletar entrega:", err);
            alert("Falha ao deletar entrega.");
          }
        }

        if (e.target.classList.contains('edit-btn')) {
          window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'registro-entregas', id } }));
        }
      });

      // Filtro simples
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        const filtered = deliveries.filter(d =>
          d.client?.name?.toLowerCase().includes(term) ||
          d.medication?.name?.toLowerCase().includes(term)
        );
        renderList(filtered);
      });

    } catch (err) {
      console.error("Erro ao carregar entregas:", err);
      container.innerHTML = `<p>Falha ao carregar entregas: ${err.message}</p>`;
      totalEl.textContent = "Total de entregas: 0";
    }
  }

  loadDeliveries();
}
