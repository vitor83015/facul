// frontend/src/pages/HomePage.js

// Importa o CSS Home

export function renderHomePage() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado. Certifique-se de que index.html tem <div id="app"></div>');
    return;
  }

 app.innerHTML = `
  <div class="container py-5">
    <header class="text-center mb-5">
      <i class="fas fa-box-open fa-3x text-primary mb-3"></i>
      <h1 class="fw-bold">Sistema de Entregas</h1>
      <p class="text-muted">Gerencie as entregas de medicamentos da sua farmácia</p>
    </header>

    <div class="row g-4">
      <div class="col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm action-card" data-action="cadastro-clientes">
          <div class="card-body text-center">
            <i class="fas fa-user-friends fa-2x text-primary mb-3"></i>
            <h5 class="card-title">Cadastro de Clientes</h5>
            <p class="card-text text-muted">Cadastre e gerencie os clientes da farmácia.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm action-card" data-action="cadastro-medicamentos">
          <div class="card-body text-center">
            <i class="fas fa-pills fa-2x text-success mb-3"></i>
            <h5 class="card-title">Cadastro de Medicamentos</h5>
            <p class="card-text text-muted">Cadastre e gerencie os medicamentos.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm action-card" data-action="registrar-entrega">
          <div class="card-body text-center">
            <i class="fas fa-truck fa-2x text-warning mb-3"></i>
            <h5 class="card-title">Registrar Entrega</h5>
            <p class="card-text text-muted">Registre uma nova entrega de medicamentos.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm action-card" data-action="listas-hub">
          <div class="card-body text-center">
            <i class="fas fa-folder-open fa-2x text-info mb-3"></i>
            <h5 class="card-title">Listas</h5>
            <p class="card-text text-muted">Visualize clientes, medicamentos e entregas.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-5">
      <button class="btn btn-outline-secondary config-button">
        <i class="fas fa-cog"></i> Configurações
      </button>
      <button class="btn btn-danger logout-button">
        <i class="fas fa-sign-out-alt"></i> Sair
      </button>
    </div>
  </div>
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
