// frontend/src/pages/HomePage.js

// Importa o CSS Home

export function renderHomePage() {
  const app = document.getElementById("app");
  if (!app) {
    console.error('Elemento #app não encontrado.');
    return;
  }

  app.innerHTML = `
    <main class="container py-5 text-center">
      <header class="mb-5">
        <h1 class="display-5 fw-bold">Sistema de Entregas</h1>
        <p class="text-muted">Gerencie as entregas de medicamentos da sua farmácia</p>
      </header>

      <div class="row justify-content-center g-4">
        <div class="col-md-5 col-lg-4">
          <a href="#" class="card h-100 text-decoration-none action-card" data-action="cadastro-clientes">
            <div class="card-body">
              <i class="fas fa-user-friends fa-2x mb-3 text-primary"></i>
              <h5 class="card-title">Cadastro de Clientes</h5>
              <p class="card-text">Cadastre e gerencie os clientes da farmácia</p>
            </div>
          </a>
        </div>

        <div class="col-md-5 col-lg-4">
          <a href="#" class="card h-100 text-decoration-none action-card" data-action="cadastro-medicamentos">
            <div class="card-body">
              <i class="fas fa-pills fa-2x mb-3 text-success"></i>
              <h5 class="card-title">Cadastro de Medicamentos</h5>
              <p class="card-text">Cadastre e gerencie os medicamentos</p>
            </div>
          </a>
        </div>

        <div class="col-md-5 col-lg-4">
          <a href="#" class="card h-100 text-decoration-none action-card" data-action="registrar-entrega">
            <div class="card-body">
              <i class="fas fa-box-open fa-2x mb-3 text-warning"></i>
              <h5 class="card-title">Registrar Entrega</h5>
              <p class="card-text">Registre uma nova entrega de medicamentos</p>
            </div>
          </a>
        </div>

        <div class="col-md-5 col-lg-4">
          <a href="#" class="card h-100 text-decoration-none action-card" data-action="listas-hub">
            <div class="card-body">
              <i class="fas fa-folder-open fa-2x mb-3 text-info"></i>
              <h5 class="card-title">Listas</h5>
              <p class="card-text">Visualize clientes, medicamentos e entregas</p>
            </div>
          </a>
        </div>
      </div>

      <footer class="mt-5">
        <button class="btn btn-outline-secondary me-2 config-button" data-action="configuracoes">
          <i class="fas fa-cog"></i> Configurações
        </button>
        <button class="btn btn-danger logout-button" data-action="sair">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </footer>
    </main>
  `;

  // === Reativar eventos ===

  // 1️⃣ - Cards de ação (navegação)
  const actionCards = app.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const action = card.getAttribute('data-action');
      if (action) {
        window.dispatchEvent(new CustomEvent('navigate', { detail: action }));
      }
    });
  });

  // 2️⃣ - Botão de logout
  const logoutButton = app.querySelector('.logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }));
    });
  }

  // 3️⃣ - Botão de configurações (ainda placeholder)
  const configButton = app.querySelector('.config-button');
  if (configButton) {
    configButton.addEventListener('click', () => {
      alert('Função de configurações em desenvolvimento.');
    });
  }
}