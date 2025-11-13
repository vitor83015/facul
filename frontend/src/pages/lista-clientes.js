import { getClients, deleteClient } from '../api/ClientApi.js';
import { renderCadastroClientes } from './cadastro-clientes.js'; // import para edição

export async function renderListaClientes() {
  const app = document.getElementById('app');
  if (!app) return console.error("#app não encontrado");

  app.innerHTML = `
    <div class="container py-5 d-flex justify-content-center">
      <div class="card shadow-lg p-4 w-100" style="max-width: 900px;">
        <header class="d-flex align-items-center mb-4">
          <button class="btn btn-outline-primary me-3 back-button" title="Voltar para Listas" aria-label="Voltar">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="d-flex align-items-center">
            <i class="fas fa-user-friends fs-3 text-primary me-2"></i>
            <div>
              <h2 class="fw-bold mb-1">Clientes Registrados</h2>
              <p class="text-muted mb-0">Visualize e gerencie todos os clientes da farmácia</p>
            </div>
          </div>
        </header>

        <div class="mb-4">
          <input type="search" class="form-control" id="searchClients" placeholder="🔍 Buscar por nome ou CPF...">
        </div>

        <section id="clients-container" class="list-group mb-3">
          <p>Carregando clientes...</p>
        </section>

        <div class="text-end text-muted" id="total-clients">
          Total de clientes: 0
        </div>
      </div>
    </div>
  `;

  const backButton = document.querySelector('.back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    });
  }

  const container = document.getElementById('clients-container');
  const totalClientsEl = document.getElementById('total-clients');
  const searchInput = document.getElementById('searchClients');

  function normalize(str) {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
  }

  try {
    const clients = await getClients();

    if (clients.length === 0) {
      container.innerHTML = '<p class="text-center text-muted">Nenhum cliente cadastrado.</p>';
      totalClientsEl.textContent = 'Total de clientes: 0';
      return;
    }

    function renderList(list) {
      container.innerHTML = list
        .map(
          (client) => `
          <div class="list-group-item d-flex justify-content-between align-items-start flex-wrap py-3 border rounded-3 mb-3 shadow-sm">
            <div class="me-3">
              <h5 class="fw-bold mb-1">${client.name} <span class="text-muted fw-normal" style="font-size: 0.9rem;">(ID: #${client.id})</span></h5>
              <p class="mb-1"><i class="fas fa-id-card text-primary me-1"></i> CPF: ${client.cpf}</p>
              <p class="mb-1"><i class="fas fa-map-marker-alt text-danger me-1"></i> ${client.address}</p>
              <p class="mb-1"><i class="fas fa-phone text-success me-1"></i> ${client.phone}</p>
              <p class="mb-0"><i class="fas fa-envelope text-secondary me-1"></i> ${client.email}</p>
            </div>
            <div class="d-flex flex-column align-items-end">
              <button class="btn btn-sm btn-outline-danger mb-2 delete-btn" data-id="${client.id}">
                <i class="fas fa-trash"></i> Deletar
              </button>
              <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${client.id}">
                <i class="fas fa-edit"></i> Editar
              </button>
            </div>
          </div>
        `
        )
        .join('');

      totalClientsEl.textContent = `Total de clientes: ${list.length}`;
    }

    renderList(clients);

    // === Busca com debounce e acento-insensitive ===
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const term = normalize(searchInput.value);
        const filtered = clients.filter(c =>
          normalize(c.name).includes(term) ||
          normalize(c.cpf).includes(term)
        );

        if (filtered.length === 0) {
          container.innerHTML = `
            <div class="alert alert-info text-center" role="alert">
              Nenhum cliente encontrado.
            </div>`;
          totalClientsEl.textContent = "Total de clientes: 0";
        } else {
          renderList(filtered);
        }
      }, 200);
    });

    // === Eventos de editar e deletar ===
    container.addEventListener('click', async (e) => {
      if (e.target.closest('.delete-btn')) {
        const id = e.target.closest('.delete-btn').dataset.id;
        if (confirm('Deseja realmente deletar este cliente?')) {
          await deleteClient(id);
          alert('Cliente deletado com sucesso!');
          renderListaClientes(); // recarrega
        }
      }

      if (e.target.closest('.edit-btn')) {
        const id = e.target.closest('.edit-btn').dataset.id;
        renderCadastroClientes(id); // abre o formulário preenchido
      }
    });
  } catch (error) {
    container.innerHTML = `<p class="text-danger">Erro ao carregar clientes: ${error.message}</p>`;
  }
}
