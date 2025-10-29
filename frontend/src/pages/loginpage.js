// loginpage.js
const BASE_URL = "http://localhost:5000";

export function renderLoginPage() {
  const app = document.getElementById("app");
  localStorage.removeItem("token");

  app.innerHTML = `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-light">
      <div class="card bg-secondary text-light shadow p-4" style="max-width: 420px; width: 100%;">
        <div class="card-body">
          <h3 class="text-center mb-4 fw-bold" id="formTitle">Fazer Login</h3>

          <!-- Formulário de Login -->
          <form id="loginForm">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">E-mail</label>
              <input type="email" id="loginEmail" class="form-control bg-dark text-light border-0" placeholder="Digite seu e-mail" required>
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Senha</label>
              <input type="password" id="loginPassword" class="form-control bg-dark text-light border-0" placeholder="Digite sua senha" required>
            </div>
            <button type="submit" class="btn btn-primary w-100 mb-3 fw-bold">Entrar</button>
            <p class="text-center">
              Não tem uma conta?
              <a href="#" id="switchToCadastro" class="link-light text-decoration-none">Cadastre-se</a>
            </p>
          </form>

          <!-- Formulário de Cadastro -->
          <form id="cadastroForm" class="d-none">
            <div class="mb-3">
              <label for="cadastroNome" class="form-label">Nome</label>
              <input type="text" id="cadastroNome" class="form-control bg-dark text-light border-0" placeholder="Seu nome completo" required>
            </div>
            <div class="mb-3">
              <label for="cadastroEmail" class="form-label">E-mail</label>
              <input type="email" id="cadastroEmail" class="form-control bg-dark text-light border-0" placeholder="Digite seu e-mail" required>
            </div>
            <div class="mb-3">
              <label for="cadastroPassword" class="form-label">Senha</label>
              <input type="password" id="cadastroPassword" class="form-control bg-dark text-light border-0" placeholder="Crie uma senha" required>
            </div>
            <div class="mb-3">
              <label for="cadastroConfirmPassword" class="form-label">Confirmar senha</label>
              <input type="password" id="cadastroConfirmPassword" class="form-control bg-dark text-light border-0" placeholder="Repita a senha" required>
            </div>
            <button type="submit" class="btn btn-success w-100 mb-3 fw-bold">Cadastrar</button>
            <p class="text-center">
              Já tem conta?
              <a href="#" id="switchToLogin" class="link-light text-decoration-none">Fazer login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `;

  const loginForm = app.querySelector("#loginForm");
  const cadastroForm = app.querySelector("#cadastroForm");
  const formTitle = app.querySelector("#formTitle");

  // Alternar entre Login e Cadastro
  app.querySelector("#switchToCadastro").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("d-none");
    cadastroForm.classList.remove("d-none");
    formTitle.textContent = "Criar Conta";
  });

  app.querySelector("#switchToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    cadastroForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
    formTitle.textContent = "Fazer Login";
  });

  // ===== Login =====
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = app.querySelector("#loginEmail").value;
    const password = app.querySelector("#loginPassword").value;

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciais inválidas");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      alert(`Bem-vindo, ${data.name}!`);
      window.dispatchEvent(new CustomEvent("navigate", { detail: "home" }));
    } catch (err) {
      alert("Erro ao fazer login: " + err.message);
    }
  });

  // ===== Cadastro =====
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = app.querySelector("#cadastroNome").value;
    const email = app.querySelector("#cadastroEmail").value;
    const password = app.querySelector("#cadastroPassword").value;
    const confirmPassword = app.querySelector("#cadastroConfirmPassword").value;

    if (password !== confirmPassword) {
      return alert("As senhas não coincidem!");
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      alert(`Conta criada com sucesso! Bem-vindo, ${data.name}`);
      window.dispatchEvent(new CustomEvent("navigate", { detail: "home" }));
    } catch (err) {
      alert("Falha ao cadastrar: " + err.message);
    }
  });
}
