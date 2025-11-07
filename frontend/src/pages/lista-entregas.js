import { getDeliveries, deleteDelivery } from '../api/DeliveryApi.js';

export async function renderListaEntregas() {
  const app = document.getElementById('app');
  if (!app) return console.error("#app não encontrado");

  app.innerHTML = `
    <div class="container py-5">
      <div class="card shadow-lg p-4">
        <header class="d-flex align-items-center mb-4">
          <button class="btn btn-outline-primary me-3 back-button" title="Voltar para Listas">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="d-flex align-items-center">
            <i class="fas fa-truck-medical fs-3 text-primary me-2"></i>
            <div>
              <h2 class="fw-bold mb-1">Entregas Registradas</h2>
              <p class="text-muted mb-0">Visualize e gerencie todas as entregas registradas</p>
            </div>
          </div>
        </header>

        <div class="mb-4">
          <input type="search" class="form-control" placeholder="Buscar por cliente ou medicamento..." id="searchDeliveries">
        </div>

        <section id="deliveries-container" class="mb-3">
          <p>Carregando entregas...</p>
        </section>

        <div class="text-end text-muted fw-semibold" id="total-deliveries">Total de entregas: 0</div>
      </div>
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
        container.innerHTML = `<div class="alert alert-warning text-center">Nenhuma entrega registrada.</div>`;
        totalEl.textContent = "Total de entregas: 0";
        return;
      }

      function renderList(list) {
        container.innerHTML = list.map(d => {
          const clientName = d.user?.name || "Cliente desconhecido"; // ✅ corrigido
          const medName = d.medication?.name || "Medicamento não informado";
          const dateFormatted = d.date ? new Date(d.date).toLocaleDateString('pt-BR') : "Data não informada";
          const timeFormatted = d.time || "Horário não informado";

          return `
            <div class="border rounded p-3 mb-3 bg-light d-flex justify-content-between flex-wrap align-items-start">
              <div class="mb-2">
                <h5 class="fw-bold mb-1">${clientName} <span class="text-muted fw-normal" style="font-size: 0.85rem;">(ID: #${d.id})</span></h5>
                <p class="mb-1"><i class="fas fa-capsules text-primary me-1"></i> ${medName} - ${d.quantity}x</p>
                <p class="mb-1"><i class="fas fa-map-marker-alt text-danger me-1"></i> ${d.address}</p>
                <p class="mb-1"><i class="fas fa-calendar-alt text-secondary me-1"></i> ${dateFormatted}</p>
                <p class="mb-0"><i class="fas fa-clock text-secondary me-1"></i> ${timeFormatted}</p>
              </div>
              <div class="d-flex flex-column align-items-end">
                <button class="btn btn-sm btn-outline-primary mb-2 edit-btn" data-id="${d.id}">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${d.id}">
                  <i class="fas fa-trash"></i> Deletar
                </button>
              </div>
            </div>
          `;
        }).join('');

        totalEl.textContent = `Total de entregas: ${list.length}`;

        // ✅ Aplica eventos de editar e deletar de forma limpa
        container.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!confirm("Deseja realmente deletar esta entrega?")) return;
            try {
              await deleteDelivery(id);
              alert("Entrega deletada com sucesso!");
              loadDeliveries();
            } catch (err) {
              console.error("Erro ao deletar entrega:", err);
              alert("Falha ao deletar entrega.");
            }
          });
        });

        container.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'registrar-entrega', id } })); // ✅ rota atualizada
          });
        });
      }

      renderList(deliveries);

      // Filtro simples
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        const filtered = deliveries.filter(d =>
          d.user?.name?.toLowerCase().includes(term) ||
          d.medication?.name?.toLowerCase().includes(term)
        );
        renderList(filtered); // ✅ re-aplica eventos sem duplicar
      });

    } catch (err) {
      console.error("Erro ao carregar entregas:", err);
      container.innerHTML = `<div class="alert alert-danger text-center">Falha ao carregar entregas: ${err.message}</div>`;
      totalEl.textContent = "Total de entregas: 0";
    }
  }

  loadDeliveries();
}
