import { createClient } from '../api/ClientApi.js';
import { setupMasks, validateEmailGmail } from '../helpers/formatters.js';

export function renderCadastroClientes() {
  const app = document.getElementById('app');
  if (!app) return console.error('Elemento #app não encontrado.');

  app.innerHTML = `
    <div class="page-container">
      <header class="page-header">
        <a href="#" id="back-link" class="back-button" title="Voltar" aria-label="Voltar">
          <i class="fas fa-arrow-left"></i>
        </a>
        <i class="fas fa-user-friends page-header-icon"></i>
        <div class="header-text">
          <h1 class="page-title">Cadastro de Clientes</h1>
          <p class="page-subtitle">Sprint 2 – Cadastre novos clientes da farmácia</p>
        </div>
      </header>

      <form class="form-card" id="form-cadastro-cliente" novalidate>
        <div class="form-grid">
          <div class="form-group" style="grid-column: 1 / -1;">
            <label for="nome">Nome Completo *</label>
            <input type="text" id="nome" placeholder="Digite o nome completo" required>
          </div>
          <div class="form-group">
            <label for="cpf">CPF *</label>
            <input type="text" id="cpf" placeholder="000.000.000-00" required>
          </div>
          <div class="form-group">
            <label for="telefone">Telefone *</label>
            <input type="tel" id="telefone" placeholder="(00) 00000-0000" required>
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label for="email">E-mail</label>
            <input type="email" id="email" placeholder="email@exemplo.com">
          </div>
          <div class="form-group" style="grid-column: 1 / -1; margin-top: 20px;">
            <label>Endereço</label>
            <input type="text" id="endereco" placeholder="Rua, número, bairro">
          </div>
          <div class="form-group">
            <label for="cidade">Cidade</label>
            <input type="text" id="cidade" placeholder="Digite a cidade">
          </div>
          <div class="form-group">
            <label for="estado">Estado</label>
            <input type="text" id="estado" placeholder="UF">
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="secondary-button back-button" id="btn-cancel">Cancelar</button>
          <button type="submit" class="primary-button" id="btn-save">Salvar Cliente</button>
        </div>
      </form>
    </div>
  `;

  // === Eventos de voltar ===
  app.querySelectorAll('.back-button, #back-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    });
  });

  // === Máscaras e validações ===
  setupMasks({
    cpfSelector: '#cpf',
    telefoneSelector: '#telefone', // ✅ corrigido
    estadoSelector: '#estado'
  });

  // === Form submit ===
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

    // === Validação de email Gmail ===
    if (data.email && !validateEmailGmail(data.email)) {
      alert('O e-mail deve ser um Gmail válido (ex.: usuario@gmail.com)');
      return;
    }

    try {
      await createClient(data);
      alert('Cliente cadastrado com sucesso!');
      form.reset();
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'lista-clientes' }));
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Falha ao cadastrar cliente. Veja o console.');
    }
  });
}
