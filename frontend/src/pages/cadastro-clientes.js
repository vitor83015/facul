import { createClient, getClientById, updateClient } from '../api/ClientApi.js';

export async function renderCadastroClientes(id = null) {
  const app = document.getElementById('app');
  if (!app) return console.error('Elemento #app não encontrado.');

  let clientData = null;

  if (id) {
    try {
      clientData = await getClientById(id);
    } catch (err) {
      console.error("Erro ao carregar cliente:", err);
      alert("Erro ao carregar dados do cliente.");
    }
  }

  app.innerHTML = `
    <div class="page-container">
      <header class="page-header">
        <a href="#" id="back-link" class="back-button"><i class="fas fa-arrow-left"></i></a>
        <h1 class="page-title">${id ? "Editar Cliente" : "Cadastro de Clientes"}</h1>
      </header>

      <form class="form-card" id="form-cadastro-cliente">
        <input type="hidden" id="cliente-id" value="${id || ''}">

        <div class="form-group">
          <label>Nome *</label>
          <input type="text" id="nome" value="${clientData?.name || ''}" required>
        </div>
        <div class="form-group">
          <label>CPF *</label>
          <input type="text" id="cpf" value="${clientData?.cpf || ''}" required>
        </div>
        <div class="form-group">
          <label>Telefone *</label>
          <input type="tel" id="telefone" value="${clientData?.phone || ''}" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="email" value="${clientData?.email || ''}">
        </div>
        <div class="form-group">
          <label>Endereço</label>
          <input type="text" id="endereco" value="${clientData?.address || ''}">
        </div>
        <div class="form-group">
          <label>Cidade</label>
          <input type="text" id="cidade" value="${clientData?.city || ''}">
        </div>
        <div class="form-group">
          <label>Estado</label>
          <input type="text" id="estado" value="${clientData?.state || ''}">
        </div>

        <div class="form-actions">
          <button type="button" id="btn-cancel" class="secondary-button">Cancelar</button>
          <button type="submit" class="primary-button">${id ? "Salvar Alterações" : "Cadastrar Cliente"}</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('btn-cancel').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'lista-clientes' }));
  });

  const form = document.getElementById('form-cadastro-cliente');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('nome').value.trim(),
      cpf: document.getElementById('cpf').value.trim(),
      phone: document.getElementById('telefone').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('endereco').value.trim(),
      city: document.getElementById('cidade').value.trim(),
      state: document.getElementById('estado').value.trim(),
    };

    try {
      if (id) {
        await updateClient(id, data);
        alert('Cliente atualizado com sucesso!');
      } else {
        await createClient(data);
        alert('Cliente cadastrado com sucesso!');
      }

      window.dispatchEvent(new CustomEvent('navigate', { detail: 'lista-clientes' }));
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Falha ao salvar cliente.');
    }
  });
}
