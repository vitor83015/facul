// frontend/script.js

// Importa as páginas
import { renderLoginPage } from './src/pages/loginpage.js';
import { renderHomePage } from './src/pages/homepage.js';
import { renderCadastroClientes } from './src/pages/cadastro-clientes.js';
import { renderCadastroMedicamentos } from './src/pages/cadastro-medicamentos.js';
import { renderListaClientes } from './src/pages/lista-clientes.js';
import { renderListaMedicamentos } from './src/pages/lista-medicamentos.js';
import { renderListaEntregas } from './src/pages/lista-entregas.js';
import { renderListasHub } from './src/pages/listas-hub.js';
import { renderRegistroEntregas } from './src/pages/registro-entregas.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  const routes = {
    login: renderLoginPage,
    home: renderHomePage,
    'cadastro-clientes': renderCadastroClientes,
    'cadastro-medicamentos': renderCadastroMedicamentos,
    'lista-clientes': renderListaClientes,
    'lista-medicamentos': renderListaMedicamentos,
    'lista-entregas': renderListaEntregas,
    'listas-hub': renderListasHub,
    'registrar-entrega': renderRegistroEntregas,
  };

  // === Função principal de navegação ===
  function navigateTo(page, id = null) {
    const renderFunction = routes[page];
    if (renderFunction) {
      app.innerHTML = '';
      renderFunction(id);
    } else {
      console.warn(`Ação '${page}' não reconhecida.`);
    }
  }

  // Inicializa mostrando Login primeiro
  navigateTo('login');

  // Delegação de clique para cards de ação na Home
  app.addEventListener('click', (event) => {
    const card = event.target.closest('.action-card');
    if (card) {
      const action = card.getAttribute('data-action');
      if (action) navigateTo(action);
    }
  });

  // Botão de logout
  window.addEventListener('click', (event) => {
    if (event.target.closest('.logout-button')) {
      console.log('Encerrando sessão...');
      navigateTo('login');
    }
  });

  // Botão de configurações
  window.addEventListener('click', (event) => {
    if (event.target.closest('.config-button')) {
      console.log('Abrindo Configurações...');
      // Futuramente abrir modal ou página de configurações
    }
  });

  // Escuta eventos customizados das páginas JS
  window.addEventListener('navigate', (e) => {
    const detail = e.detail;

    // Se detail for string, assume que é só a página
    if (typeof detail === 'string') {
      navigateTo(detail);
      return;
    }

    // Se detail for objeto, pode ter page + id
    if (typeof detail === 'object' && detail.page) {
      navigateTo(detail.page, detail.id || null);
    }
  });

  // Eventos de submit de formulários
  window.addEventListener('cliente:submit', (event) => {
    console.log('Formulário Cliente:', event.detail);
    // Aqui você pode integrar com backend
  });

  window.addEventListener('medicamento:submit', (event) => {
    console.log('Formulário Medicamento:', event.detail);
    // Aqui você pode integrar com backend
  });

  window.addEventListener('entrega:submit', (event) => {
    console.log('Formulário Entrega:', event.detail);
    // Aqui você pode integrar com backend
    navigateTo('home'); // volta pra home depois do registro
  });
});
