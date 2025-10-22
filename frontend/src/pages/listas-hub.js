// src/pages/listas-hub.js
export function renderListasHub() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-container" style="max-width: 800px;">
      <header class="page-header">
        <button class="back-button" data-action="home" title="Voltar para Home" aria-label="Voltar">
          <i class="fas fa-arrow-left"></i>
        </button>
        <i class="fas fa-folder-open page-header-icon"></i>
        <div class="header-text">
          <h1 class="page-title">Listas</h1>
          <p class="page-subtitle">Selecione qual lista deseja visualizar</p>
        </div>
      </header>

      <section class="grid-container" style="grid-template-columns: 1fr 1fr;">
        <div class="action-card" data-action="lista-clientes">
          <i class="fas fa-user-friends card-icon"></i>
          <div class="card-content">
            <h2 class="card-title">Clientes</h2>
            <p class="card-description">Lista de clientes registrados</p>
          </div>
        </div>

        <div class="action-card" data-action="lista-medicamentos">
          <i class="fas fa-capsules card-icon"></i>
          <div class="card-content">
            <h2 class="card-title">Medicamentos</h2>
            <p class="card-description">Lista de medicamentos em estoque</p>
          </div>
        </div>

        <div class="action-card" data-action="lista-entregas">
          <i class="fas fa-truck-moving card-icon"></i>
          <div class="card-content">
            <h2 class="card-title">Entregas</h2>
            <p class="card-description">Visualize todas as entregas e status</p>
          </div>
        </div>
      </section>
    </div>
  `;
}
