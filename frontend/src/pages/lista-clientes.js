import { getClients, deleteClient } from '../api/ClientApi.js';
import { renderCadastroClientes } from './cadastro-clientes.js'; // import para edição

export async function renderListaClientes() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-container">
      <header class="page-header">
        <button class="back-button" title="Voltar para Listas" aria-label="Voltar">
          <i class="fas fa-arrow-left"></i>
        </button>
        <i class="fas fa-user-friends page-header-icon"></i>
        <div class="header-text">
          <h1 class="page-title">Clientes Registrados</h1>
          <p class="page-subtitle">Visualize e gerencie todos os clientes da farmácia</p>
        </div>
      </header>

      <input type="search" class="search-bar" placeholder="Buscar por nome ou CPF...">

      <section class="delivery-list" id="clients-container">
        <!-- Clientes do backend vão aparecer aqui -->
      </section>

      <div class="total-entregas" id="total-clients">
        Total de clientes: 0
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

  try {
    const clients = await getClients();

    if (clients.length === 0) {
      container.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
      totalClientsEl.textContent = 'Total de clientes: 0';
      return;
    }

    clients.forEach(client => {
      const clientDiv = document.createElement('div');
      clientDiv.classList.add('delivery-item');
      clientDiv.style.gridTemplateColumns = '2fr 1fr';
      clientDiv.innerHTML = `
        <div class="delivery-info">
          <span class="client-name">${client.name} <span style="font-weight: 400; font-size: 0.8rem;">(ID: #${client.id})</span></span>
          <span class="client-info"><i class="fas fa-id-card"></i> CPF: ${client.cpf}</span>
          <span class="client-info"><i class="fas fa-map-marker-alt"></i> ${client.address}</span>
        </div>
        <div class="delivery-info">
          <span class="client-info"><i class="fas fa-phone"></i> ${client.phone}</span>
          <span class="client-info"><i class="fas fa-envelope"></i> ${client.email}</span>
        </div>
        <div class="delivery-actions">
          <button class="edit-btn" data-id="${client.id}">Editar</button>
          <button class="delete-btn" data-id="${client.id}">Deletar</button>
        </div>
      `;
      container.appendChild(clientDiv);
    });

    totalClientsEl.textContent = `Total de clientes: ${clients.length}`;

    // === Eventos de editar e deletar ===
    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        if (confirm("Deseja realmente deletar este cliente?")) {
          await deleteClient(id); // token já é enviado pelo ClientApi.js
          renderListaClientes(); // re-renderiza
        }
      }

      if (e.target.classList.contains('edit-btn')) {
        const id = e.target.getAttribute('data-id');
        renderCadastroClientes(id); // abre o formulário preenchido
      }
    });

  } catch (error) {
    container.innerHTML = `<p>Erro ao carregar clientes: ${error.message}</p>`;
  }
}
