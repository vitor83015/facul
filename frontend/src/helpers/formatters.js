// ==========================
// Função para aplicar máscaras e validação de entradas
// ==========================
export function setupMasks({ cpfSelector, telefoneSelector, estadoSelector }) {
  const cpfInput = document.querySelector(cpfSelector);
  const telefoneInput = document.querySelector(telefoneSelector);
  const estadoInput = document.querySelector(estadoSelector);

  // ===== CPF: só números e máscara =====
  if (cpfInput) {
    cpfInput.addEventListener('input', e => {
      let value = e.target.value.replace(/\D/g, '').slice(0, 11); // Limita a 11 números
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    });
  }

  // ===== Telefone: só números e máscara =====
  if (telefoneInput) {
    telefoneInput.addEventListener('input', e => {
      let value = e.target.value.replace(/\D/g, '').slice(0, 11); // Limita a 11 números
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
      }
      e.target.value = value;
    });
  }

  // ===== Estado: maiúsculo e 2 caracteres =====
  if (estadoInput) {
    estadoInput.addEventListener('input', e => {
      e.target.value = e.target.value.toUpperCase().slice(0, 2);
    });
  }
}

// ==========================
// Validação de email Gmail
// ==========================
export function validateEmailGmail(email) {
  return /^[\w.-]+@gmail\.com$/.test(email);
}

// ==========================
// Função auxiliar: aplicar máscara de CPF formatada
// ==========================
export function formatCPF(cpf) {
  const numbers = cpf.replace(/\D/g, '').slice(0, 11);
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// ==========================
// Função auxiliar: aplicar máscara de telefone formatada
// ==========================
export function formatTelefone(telefone) {
  const numbers = telefone.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
}
