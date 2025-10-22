// frontend/src/pages/HomePage.js

// Importa o CSS Home
import '../../styles.css'; // CSS exclusivo da homepage

export function renderHomePage() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado. Certifique-se de que index.html tem <div id="app"></div>');
    return;
  }

  app.innerHTML = `
    <main class="main-content">
      <header class="header">
        <i class="fas fa-link header-icon"></i>
        <h1 class="system-title">Sistema de Entregas</h1>
        <p class="system-subtitle">Gerencie as entregas de medicamentos da sua farmácia</p>
      </header>

      <section class="grid-container">
        <a href="#" class="action-card" data-action="cadastro-clientes">
          <i class="fas fa-user-friends card-icon"></i>
          <div class="card-content">
            <h2 class="card-title">Cadastro de Clientes</h2>
            <p class="card-description">Cadastre e gerencie os clientes da farmácia</p>
          </div>
        </a>

        <a href="#" class="action-card" data-action="cadastro-medicamentos">
          <i class="fas fa-link card-icon"></i>
          <div class="card-content">
            <h2 class="card-title">Cadastro de Medicamentos</h2>
            <p class="card-description">Cadastre e gerencie os medicamentos</p>
          </div>
        </a>

        <a href="#" class="action-card" data-action="registrar-entrega">
          <i class="fas fa-box-open card-icon"></i>
          <div class="card-content">
            <h2 class="card-title">Registrar Entrega</h2>
            <p class="card-description">Registre uma nova entrega de medicamentos</p>
          </div>
        </a>

        <a href="#" class="action-card" data-action="listas-hub">
          <i class="fas fa-folder-open card-icon"></i>
          <div class="card-content">
            <h2 class="card-title">Listas</h2>
            <p class="card-description">Visualize clientes, medicamentos e entregas</p>
          </div>
        </a>
      </section>

      <footer class="footer-actions">
        <button class="config-button" data-action="configuracoes">
          <i class="fas fa-cog"></i> Configurações
        </button>
        <button class="logout-button" data-action="sair">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </footer>
    </main>
  `;

  // === Interações ===

  // Cards de ação
  const actionCards = app.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault(); // evita que a âncora recarregue a página
      const action = card.getAttribute('data-action');
      if (action) {
        const event = new CustomEvent('navigate', { detail: action });
        window.dispatchEvent(event);
      }
    });
  });

  // Botão de logout
  const logoutButton = app.querySelector('.logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // Navega de volta para a página de login
      const event = new CustomEvent('navigate', { detail: 'login' });
      window.dispatchEvent(event);
    });
  }

  // Botão de configurações
  const configButton = app.querySelector('.config-button');
  if (configButton) {
    configButton.addEventListener('click', () => {
      console.log('Abrindo Configurações...');
      // Futuramente: abrir modal ou página de configurações
    });
  }
}
