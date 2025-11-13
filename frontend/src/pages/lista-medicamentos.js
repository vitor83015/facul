import { getMedications, deleteMedication } from '../api/ClientApi.js';

export async function renderListaMedicamentos() {
  const app = document.getElementById('app');
  if (!app) return console.error("#app não encontrado");

  app.innerHTML = `
    <div class="container py-5">
      <div class="card shadow-lg p-4">
        <header class="d-flex align-items-center mb-4">
          <button class="btn btn-outline-primary me-3 back-button" title="Voltar para Home">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="d-flex align-items-center">
            <i class="fas fa-capsules fs-3 text-primary me-2"></i>
            <div>
              <h2 class="fw-bold mb-1">Medicamentos em Estoque</h2>
              <p class="text-muted mb-0">Visualize e gerencie o estoque de medicamentos</p>
            </div>
          </div>
        </header>

        <div class="mb-4">
          <input type="search" class="form-control" placeholder="Buscar por medicamento, princípio ativo ou lote..." id="searchMedications">
        </div>

        <section id="medications-container" class="mb-3">
          <p>Carregando medicamentos...</p>
        </section>

        <div class="text-end text-muted fw-semibold" id="total-medications">
          Total de itens em estoque: 0
        </div>
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

  function normalize(str) {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
  }

  async function loadMedications() {
    try {
      const medications = await getMedications();

      if (!medications.length) {
        container.innerHTML = `
          <div class="alert alert-warning text-center" role="alert">
            Nenhum medicamento registrado.
          </div>`;
        totalEl.textContent = "Total de itens em estoque: 0";
        return;
      }

      function renderList(list) {
        container.innerHTML = list.map(m => `
          <div class="border rounded p-3 mb-3 bg-light">
            <div class="row">
              <div class="col-md-6">
                <h5 class="fw-bold mb-1">${m.name}</h5>
                <p class="mb-1 text-secondary"><i class="fas fa-flask me-1"></i> Princípio Ativo: ${m.active}</p>
                <p class="mb-1 text-secondary"><i class="fas fa-industry me-1"></i> Fabricante: ${m.manufacturer}</p>
              </div>
              <div class="col-md-6 d-flex flex-column align-items-md-end">
                <p class="mb-1"><i class="fas fa-hashtag me-1"></i> Lote: ${m.batch || '-'}</p>
                <p class="mb-1 fw-semibold text-success">
                  <i class="fas fa-warehouse me-1"></i> Estoque: ${m.stock} und.
                </p>
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-primary edit-btn me-2" data-id="${m.id}">
                    <i class="fas fa-edit"></i> Editar
                  </button>
                  <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${m.id}">
                    <i class="fas fa-trash"></i> Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('');

        totalEl.textContent = `Total de itens em estoque: ${list.length}`;
      }

      renderList(medications);

      // ===== Eventos de deletar =====
      container.addEventListener('click', async (e) => {
        if (e.target.closest('.delete-btn')) {
          const id = e.target.closest('.delete-btn').dataset.id;
          if (!confirm("Deseja realmente deletar este medicamento?")) return;
          try {
            await deleteMedication(id);
            alert("Medicamento deletado com sucesso!");
            loadMedications();
          } catch (err) {
            console.error("Erro ao deletar medicamento:", err);
            alert("Falha ao deletar medicamento.");
          }
        }

        if (e.target.closest('.edit-btn')) {
          const id = e.target.closest('.edit-btn').dataset.id;
          window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'cadastro-medicamentos', id } }));
        }
      });

      // ===== Busca com debounce e acento-insensitive =====
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const term = normalize(searchInput.value);
          const filtered = medications.filter(m =>
            normalize(m.name).includes(term) ||
            normalize(m.active).includes(term) ||
            normalize(m.batch || '').includes(term)
          );

          if (filtered.length === 0) {
            container.innerHTML = `
              <div class="alert alert-info text-center" role="alert">
                Nenhum medicamento encontrado.
              </div>`;
            totalEl.textContent = "Total de itens em estoque: 0";
          } else {
            renderList(filtered);
          }
        }, 200);
      });

    } catch (err) {
      console.error("Erro ao carregar medicamentos:", err);
      container.innerHTML = `<div class="alert alert-danger" role="alert">
        Falha ao carregar medicamentos: ${err.message}
      </div>`;
      totalEl.textContent = "Total de itens em estoque: 0";
    }
  }

  loadMedications();
}
