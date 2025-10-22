// src/pages/registro-entregas.js
import { getClients, getMedications, createDelivery, getDeliveryById, updateDelivery } from '../api/ClientApi.js';

export async function renderRegistroEntregas(id = null) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-container">
      <header class="page-header">
        <button class="back-button" title="Voltar para Home" aria-label="Voltar">
          <i class="fas fa-arrow-left"></i>
        </button>
        <i class="fas fa-box-open page-header-icon"></i>
        <div class="header-text">
          <h1 class="page-title">Registro de Entregas</h1>
          <p class="page-subtitle">Sprint 4 – Registre uma nova entrega de medicamento</p>
        </div>
      </header>

      <form class="form-card" id="formEntrega">
        <div class="form-grid">
          <div class="form-group">
            <label for="cliente">Cliente *</label>
            <select id="cliente" required>
              <option value="">Carregando clientes...</option>
            </select>
          </div>

          <div class="form-group">
            <label for="medicamento">Medicamento *</label>
            <select id="medicamento" required>
              <option value="">Carregando medicamentos...</option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantidade">Quantidade *</label>
            <input type="number" id="quantidade" value="0" min="0" required>
          </div>

          <div class="form-group">
            <label for="data">Data da Entrega *</label>
            <input type="date" id="data" required>
          </div>

          <div class="form-group">
            <label for="horario">Horário *</label>
            <input type="time" id="horario" required>
          </div>

          <div class="form-group" style="grid-column: 1 / -1; margin-top: 20px;">
            <label for="endereco">Endereço de Entrega *</label>
            <input type="text" id="endereco" placeholder="Rua, número, bairro, cidade" required>
          </div>

          <div class="form-group" style="grid-column: 1 / -1; margin-top: 20px;">
            <label for="observacoes">Observações</label>
            <textarea id="observacoes" placeholder="Informações adicionais sobre a entrega"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="secondary-button" id="cancelarEntrega">Cancelar</button>
          <button type="submit" class="primary-button">${id ? "Atualizar Entrega" : "Registrar Entrega"}</button>
        </div>
      </form>
    </div>
  `;

  // ===== Voltar para Home =====
  document.querySelector('.back-button').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
  });

  const clienteSelect = document.getElementById('cliente');
  const medSelect = document.getElementById('medicamento');

  // ===== Carregar clientes e medicamentos =====
  try {
    const clients = await getClients();
    const medications = await getMedications();

    clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    medSelect.innerHTML = '<option value="">Selecione um medicamento</option>';

    clients.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      clienteSelect.appendChild(opt);
    });

    medications.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} - ${m.dosage}`;
      medSelect.appendChild(opt);
    });

    // ===== Se estiver editando, preencher dados =====
    if (id) {
      const delivery = await getDeliveryById(id);
      clienteSelect.value = delivery.client.id;
      medSelect.value = delivery.medication.id;
      document.getElementById('quantidade').value = delivery.quantity;
      const dt = new Date(delivery.date);
      document.getElementById('data').value = dt.toISOString().slice(0, 10); // YYYY-MM-DD
      document.getElementById('horario').value = delivery.time; 
      document.getElementById('endereco').value = delivery.address;
      document.getElementById('observacoes').value = delivery.notes;
    }

  } catch (err) {
    alert("Falha ao carregar clientes ou medicamentos");
    console.error(err);
  }

  // ===== Submit =====
  document.getElementById('formEntrega').addEventListener('submit', async e => {
    e.preventDefault();

    const clienteId = Number(clienteSelect.value);
    const medicamentoId = Number(medSelect.value);
    const quantity = Number(document.getElementById('quantidade').value); // <- corrigido
    const dateInput = document.getElementById('data').value;
    const timeInput = document.getElementById('horario').value;
    const endereco = document.getElementById('endereco').value;
    const observacoes = document.getElementById('observacoes').value;

    // ===== Validar campos obrigatórios =====
    if (!clienteId || !medicamentoId || !quantity || !dateInput || !timeInput || !endereco) {
      return alert("Preencha todos os campos obrigatórios!");
    }

// ===== Montar deliveryData =====
const deliveryData = {
  clientId: clienteId,
  medicationId: medicamentoId,
  quantity: quantity,
  date: dateInput,  // já vem como "YYYY-MM-DD" do input
  time: timeInput,  // já vem como "HH:mm" do input
  address: endereco,
  notes: observacoes,
};

try {
  if (id) {
    await updateDelivery(id, deliveryData);
    alert('Entrega atualizada com sucesso!');
  } else {
    await createDelivery(deliveryData);
    alert('Entrega registrada com sucesso!');
  }
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'lista-entregas' }));
} catch (err) {
  console.error(err);
  alert('Erro ao salvar entrega: ' + (err.message || err));
}
  });

  // ===== Cancelar =====
  document.getElementById('cancelarEntrega').addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'lista-entregas' }));
});
}
