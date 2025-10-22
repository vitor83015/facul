// loginpage.js
import '../styles/login.css';
const BASE_URL = "http://localhost:5000";

export function renderLoginPage() {
  const app = document.getElementById('app');

  // 🔹 Limpa token antigo do localStorage
  localStorage.removeItem("token");

  app.innerHTML = `
    <section class="containerPai">
      <div class="card loginActive">
        <div class="esquerda">
          <div class="formLogin">
            <h2>Fazer Login</h2>
            <form id="loginForm">
              <input type="text" id="loginEmail" placeholder="E-mail ou Usuário" required>
              <input type="password" id="loginPassword" placeholder="Senha" required>
              <button type="submit">Entrar</button>
            </form>
          </div>
          <div class="facaLogin">
            <h2>Já tem <br>uma conta?</h2>
            <p>Insira seus dados para acessar o sistema.</p>
            <button class="loginButton">Faça Login</button>
          </div>
        </div>
        <div class="direita">
          <div class="formCadastro">
            <h2>Cadastro</h2>
            <form id="cadastroForm">
              <input type="text" id="cadastroNome" placeholder="Nome" required>
              <input type="text" id="cadastroEmail" placeholder="E-mail" required>
              <input type="password" id="cadastroPassword" placeholder="Senha" required>
              <input type="password" id="cadastroConfirmPassword" placeholder="Confirmar Senha" required>
              <button type="submit">Cadastrar</button>
            </form>
          </div>
          <div class="facaCadastro">
            <h2>Não tem <br>uma conta?</h2>
            <p>Cadastre-se e comece a usar o sistema.</p>
            <button class="cadastroButton">Cadastre-se</button>
          </div>
        </div>
      </div>
    </section>
  `;

  const card = app.querySelector('.card');
  const loginButton = app.querySelector('.loginButton');
  const cadastroButton = app.querySelector('.cadastroButton');

  // Alternar telas Login / Cadastro
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      card.classList.add('loginActive');
      card.classList.remove('cadastroActive');
    });
  }

  if (cadastroButton) {
    cadastroButton.addEventListener('click', () => {
      card.classList.add('cadastroActive');
      card.classList.remove('loginActive');
    });
  }

  // ===== Login =====
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = app.querySelector('#loginEmail').value;
      const password = app.querySelector('#loginPassword').value;

      try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Credenciais inválidas");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log("Login bem-sucedido:", data);
        alert(`Bem-vindo, ${data.name}!`);
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
      } catch (err) {
        console.error("Erro ao logar:", err);
        alert("Falha ao logar: usuário não cadastrado ou senha incorreta.");
      }
    });
  }

  // ===== Cadastro =====
  const cadastroForm = document.getElementById('cadastroForm');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = app.querySelector('#cadastroNome').value;
      const email = app.querySelector('#cadastroEmail').value;
      const password = app.querySelector('#cadastroPassword').value;
      const confirmPassword = app.querySelector('#cadastroConfirmPassword').value;

      if (password !== confirmPassword) {
        return alert("As senhas não coincidem!");
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Falha ao cadastrar");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log("Cadastro bem-sucedido:", data);
        alert(`Conta criada com sucesso! Bem-vindo, ${data.name}`);
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
      } catch (err) {
        console.error("Erro ao cadastrar:", err);
        alert("Falha ao cadastrar: email já existente ou outro erro.");
      }
    });
  }
}
