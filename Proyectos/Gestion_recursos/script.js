const showManagement = document.getElementById('showManagement');
const hideManagement = document.getElementById('hideManagement');
const welcomeSection = document.getElementById('welcomeSection');
const managementSection = document.getElementById('managementSection');
const productRows = document.querySelectorAll('.product-row');
const productActions = document.getElementById('productActions');
const selectedProductName = document.getElementById('selectedProductName');
const selectedProductQuantity = document.getElementById('selectedProductQuantity');
const btnEntry = document.getElementById('btnEntry');
const btnExit = document.getElementById('btnExit');
const actionForm = document.getElementById('actionForm');
const actionAmount = document.getElementById('actionAmount');
const applyAction = document.getElementById('applyAction');
const historyList = document.getElementById('historyList');
const historyPanel = document.getElementById('historyPanel');

let selectedRow = null;
let currentAction = null;

showManagement.addEventListener('click', function () {
  welcomeSection.classList.add('hidden');
  managementSection.classList.remove('hidden');
});

hideManagement.addEventListener('click', function () {
  managementSection.classList.add('hidden');
  welcomeSection.classList.remove('hidden');
});

productRows.forEach((row) => {
  row.addEventListener('click', () => {
    if (selectedRow === row && !productActions.classList.contains('hidden')) {
      hideProductActions();
      return;
    }

    selectProduct(row);
  });
});

btnEntry.addEventListener('click', () => {
  setCurrentAction('entry');
});

btnExit.addEventListener('click', () => {
  setCurrentAction('exit');
});

function highlightProduct(row) {
  if (selectedRow) {
    selectedRow.classList.remove('selected');
  }

  selectedRow = row;
  selectedRow.classList.add('selected');
}

function hideProductActions() {
  if (selectedRow) {
    selectedRow.classList.remove('selected');
  }
  selectedRow = null;
  currentAction = null;
  productActions.classList.add('hidden');
  actionForm.classList.add('hidden');
  historyPanel.classList.add('hidden');
}


applyAction.addEventListener('click', () => {
  if (!selectedRow) return;

  const amount = Number(actionAmount.value);
  if (!amount || amount < 1) {
    alert('Ingresa una cantidad válida.');
    return;
  }

  const quantityCell = selectedRow.querySelector('td:nth-child(2)');
  const entryCell = selectedRow.querySelector('td:nth-child(3)');
  const exitCell = selectedRow.querySelector('td:nth-child(4)');
  let currentQuantity = Number(quantityCell.textContent);
  let entryValue = parsePlaceholder(entryCell.textContent);
  let exitValue = parsePlaceholder(exitCell.textContent);

  if (currentAction === 'entry') {
    currentQuantity += amount;
    entryValue = amount;
    entryCell.textContent = entryValue;
    addHistoryEntry(selectedRow.dataset.product, 'entrada', amount, currentQuantity);
  } else if (currentAction === 'exit') {
    if (amount > currentQuantity) {
      alert('No hay suficiente stock para esta salida.');
      return;
    }

    const newQuantity = currentQuantity - amount;
    if (newQuantity === 0) {
      const deleteProduct = confirm('La cantidad quedará en 0. ¿Deseas eliminar el producto del inventario?');
      if (deleteProduct) {
        addHistoryEntry(selectedRow.dataset.product, 'salida', amount, 0);
        selectedRow.remove();
        hideProductActions();
        return;
      }
    }

    currentQuantity = newQuantity;
    exitValue = amount;
    exitCell.textContent = exitValue;
    addHistoryEntry(selectedRow.dataset.product, 'salida', amount, currentQuantity);
  }

  quantityCell.textContent = currentQuantity;
  selectedProductQuantity.textContent = currentQuantity;
  actionForm.classList.add('hidden');
  actionAmount.value = 1;
});

function parsePlaceholder(text) {
  const normalized = text.trim();
  return normalized === '----' ? 0 : Number(normalized);
}

function addHistoryEntry(product, type, amount, quantity) {
  historyPanel.classList.remove('hidden');
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const item = document.createElement('li');
  item.innerHTML = `<strong>${product}</strong> - ${type === 'entrada' ? 'Entró' : 'Salió'} ${amount} <span>(${timestamp})</span>`;
  historyList.prepend(item);
}

function selectProduct(row) {
  highlightProduct(row);
  selectedProductName.textContent = row.dataset.product;
  selectedProductQuantity.textContent = row.querySelector('td:nth-child(2)').textContent;
  productActions.classList.remove('hidden');
  actionForm.classList.add('hidden');
  currentAction = null;
}

function setCurrentAction(action) {
  currentAction = action;
  actionForm.classList.remove('hidden');
  if (action === 'entry') {
    applyAction.textContent = 'Sumar entrada';
  } else {
    applyAction.textContent = 'Registrar salida';
  }
}
