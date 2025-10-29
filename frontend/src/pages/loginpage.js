// loginpage.js
const BASE_URL = "http://localhost:5000";

export function renderLoginPage() {
  const app = document.getElementById("app");
  localStorage.removeItem("token");

  app.innerHTML = `
    <div class="container py-5 d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%;">
        <ul class="nav nav-tabs mb-3" id="loginTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab">
              Login
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="cadastro-tab" data-bs-toggle="tab" data-bs-target="#cadastro" type="button" role="tab">
              Cadastro
            </button>
          </li>
        </ul>

        <div class="tab-content" id="loginTabsContent">
          <!-- Aba de Login -->
          <div class="tab-pane fade show active" id="login" role="tabpanel">
            <form id="loginForm">
              <div class="mb-3">
                <label class="form-label">E-mail ou Usuário</label>
                <input type="text" id="loginEmail" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Senha</label>
                <input type="password" id="loginPassword" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-primary w-100">Entrar</button>
            </form>
          </div>

          <!-- Aba de Cadastro -->
          <div class="tab-pane fade" id="cadastro" role="tabpanel">
            <form id="cadastroForm">
              <div class="mb-3">
                <label class="form-label">Nome</label>
                <input type="text" id="cadastroNome" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">E-mail</label>
                <input type="email" id="cadastroEmail" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Senha</label>
                <input type="password" id="cadastroPassword" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Confirmar Senha</label>
                <input type="password" id="cadastroConfirmPassword" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-success w-100">Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // === Ações ===
  const BASE_URL = "http://localhost:5000";

  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error("Credenciais inválidas");

        const data = await res.json();
        localStorage.setItem("token", data.token);
        alert(`Bem-vindo, ${data.name}!`);
        window.dispatchEvent(new CustomEvent("navigate", { detail: "home" }));
      } catch (err) {
        alert("Falha ao logar: usuário não cadastrado ou senha incorreta.");
      }
    });
  }

  // Cadastro
  const cadastroForm = document.getElementById("cadastroForm");
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("cadastroNome").value;
      const email = document.getElementById("cadastroEmail").value;
      const password = document.getElementById("cadastroPassword").value;
      const confirmPassword = document.getElementById("cadastroConfirmPassword").value;

      if (password !== confirmPassword) {
        return alert("As senhas não coincidem!");
      }

      try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) throw new Error("Falha ao cadastrar");

        const data = await res.json();
        localStorage.setItem("token", data.token);
        alert(`Conta criada com sucesso! Bem-vindo, ${data.name}`);
        window.dispatchEvent(new CustomEvent("navigate", { detail: "home" }));
      } catch (err) {
        alert("Falha ao cadastrar: email já existente ou outro erro.");
      }
    });
  }
}