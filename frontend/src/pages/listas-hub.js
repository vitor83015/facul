// src/pages/listas-hub.js
export function renderListasHub() {
  const app = document.getElementById('app');
  if (!app) return console.error("#app não encontrado");

  app.innerHTML = `
    <div class="container py-5 d-flex justify-content-center">
      <div class="card shadow-lg p-4 w-100" style="max-width: 800px;">
        <header class="d-flex align-items-center mb-4">
          <button class="btn btn-outline-primary me-3 back-button" data-action="home" title="Voltar para Home" aria-label="Voltar">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="d-flex align-items-center">
            <i class="fas fa-folder-open fs-3 text-primary me-2"></i>
            <div>
              <h2 class="fw-bold mb-1">Listas</h2>
              <p class="text-muted mb-0">Selecione qual lista deseja visualizar</p>
            </div>
          </div>
        </header>

        <section class="row gy-4">
          <div class="col-md-6">
            <div class="card border-0 shadow-sm action-card h-100 text-center p-4" data-action="lista-clientes" role="button">
              <i class="fas fa-user-friends fs-1 text-primary mb-3"></i>
              <h5 class="fw-bold mb-1">Clientes</h5>
              <p class="text-muted mb-0">Lista de clientes registrados</p>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card border-0 shadow-sm action-card h-100 text-center p-4" data-action="lista-medicamentos" role="button">
              <i class="fas fa-capsules fs-1 text-success mb-3"></i>
              <h5 class="fw-bold mb-1">Medicamentos</h5>
              <p class="text-muted mb-0">Lista de medicamentos em estoque</p>
            </div>
          </div>

          <div class="col-md-6 mx-auto">
            <div class="card border-0 shadow-sm action-card h-100 text-center p-4" data-action="lista-entregas" role="button">
              <i class="fas fa-truck-moving fs-1 text-warning mb-3"></i>
              <h5 class="fw-bold mb-1">Entregas</h5>
              <p class="text-muted mb-0">Visualize todas as entregas e status</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  // ===== Eventos de clique para navegação =====
  app.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: action } }));
    });
  });

  // ===== Botão voltar =====
  const backButton = app.querySelector('.back-button');
  backButton.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
  });
}
