import { updateSurface, setGridVisibility, setNumbersVisibility, resetView } from './plotter.js';

// UI Elements
let functionList, saveFunctionBtn, newFunctionBtn, deleteFunctionBtn;
let helpBtn, resetBtn, helpModal, modalClose;
let loadingIndicator;
let isNewFunctionMode = false; // Track if we're creating a new function

/**
 * Initialize user controls
 */
export function initControls() {
  // Get DOM elements
  functionList = document.getElementById('functionList');
  saveFunctionBtn = document.getElementById('saveFunctionBtn');
  newFunctionBtn = document.getElementById('newFunctionBtn');
  deleteFunctionBtn = document.getElementById('deleteFunctionBtn');
  helpBtn = document.getElementById('helpBtn');
  resetBtn = document.getElementById('resetBtn');
  helpModal = document.getElementById('helpModal');
  modalClose = document.querySelector('.modal-close');
  loadingIndicator = document.getElementById('loadingIndicator');

  // Setup event listeners
  setupEventListeners();

  // Initialize function list
  updateFunctionList();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Plot button
  document.getElementById('updateButton').addEventListener('click', handlePlot);

  // Toggle controls
  document.getElementById('toggleControls').addEventListener('click', () => {
    const controls = document.getElementById('controls');
    const toggleBtn = document.getElementById('toggleControls');
    controls.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  // Visibility controls
  document.getElementById('showGrid').addEventListener('change', (e) => {
    setGridVisibility(e.target.checked);
  });

  document.getElementById('showNumbers').addEventListener('change', (e) => {
    setNumbersVisibility(e.target.checked);
  });

  // Help modal
  helpBtn.addEventListener('click', () => {
    helpModal.style.display = 'block';
  });

  modalClose.addEventListener('click', () => {
    helpModal.style.display = 'none';
  });

  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      helpModal.style.display = 'none';
    }
  });

  // Reset view
  resetBtn.addEventListener('click', () => {
    resetView();
    showPopup('View reset to default position', 'info');
  });

  // Function list implicit loading
  functionList.addEventListener('change', handleFunctionLoad);

  // Save function
  saveFunctionBtn.addEventListener('click', handleFunctionSave);

  // New function
  newFunctionBtn.addEventListener('click', handleNewFunction);

  // Delete function
  deleteFunctionBtn.addEventListener('click', handleFunctionDelete);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  // Loading indicator for plot operations
  document.getElementById('updateButton').addEventListener('click', () => {
    showLoading();
    setTimeout(hideLoading, 500);
  });
}

/**
 * Handle plot button click
 */
function handlePlot() {
  const funcStr = document.getElementById('functionInput').value;
  const xMin = parseFloat(document.getElementById('xMin').value);
  const xMax = parseFloat(document.getElementById('xMax').value);
  const yMin = parseFloat(document.getElementById('yMin').value);
  const yMax = parseFloat(document.getElementById('yMax').value);

  if (xMin >= xMax || yMin >= yMax) {
    showPopup('Minimum values must be less than maximum values.', 'error');
    return;
  }

  try {
    const func = new Function('x', 'y', `return ${funcStr};`);
    // Test the function with sample values
    func((xMin + xMax) / 2, (yMin + yMax) / 2);
    updateSurface(func, xMin, xMax, yMin, yMax);
  } catch (error) {
    showPopup('Invalid function: ' + error.message, 'error');
  }
}

/**
 * Handle implicit function loading from dropdown
 */
function handleFunctionLoad() {
  const selectedName = functionList.value;
  if (!selectedName) return;

  isNewFunctionMode = false; // We're now modifying an existing function

  let funcData;
  let displayName = selectedName;

  // Check if it's a default function
  if (selectedName.startsWith('default_')) {
    const defaultName = selectedName.replace('default_', '');
    const defaultFunctions = {
      'Paraboloid': {
        function: 'x*x + y*y',
        xMin: '-2',
        xMax: '2',
        yMin: '-2',
        yMax: '2'
      },
      'Sine Wave': {
        function: 'Math.sin(x) * Math.cos(y)',
        xMin: '-3.14',
        xMax: '3.14',
        yMin: '-3.14',
        yMax: '3.14'
      },
      'Gaussian': {
        function: 'Math.exp(-(x*x + y*y))',
        xMin: '-2',
        xMax: '2',
        yMin: '-2',
        yMax: '2'
      },
      'Ripple': {
        function: 'Math.sin(Math.sqrt(x*x + y*y))',
        xMin: '-6.28',
        xMax: '6.28',
        yMin: '-6.28',
        yMax: '6.28'
      }
    };
    funcData = defaultFunctions[defaultName];
    displayName = `★ ${defaultName}`;
  } else {
    // Load from saved functions
    funcData = loadFunction(selectedName);
  }

  if (funcData) {
    // Ask for confirmation before loading
    if (confirm(`Load function "${displayName}"? This will replace your current function and settings.`)) {
      document.getElementById('functionInput').value = funcData.function;
      document.getElementById('xMin').value = funcData.xMin;
      document.getElementById('xMax').value = funcData.xMax;
      document.getElementById('yMin').value = funcData.yMin;
      document.getElementById('yMax').value = funcData.yMax;

      // Trigger update
      handlePlot();
      showPopup(`Function "${displayName}" loaded.`, 'success');
    } else {
      // Reset selection if user cancels
      functionList.value = '';
    }
  }
}

/**
 * Handle function saving with different behavior for new vs modify modes
 */
function handleFunctionSave() {
  const currentFunction = document.getElementById('functionInput').value.trim();
  if (!currentFunction) {
    showPopup('Please enter a function first.', 'error');
    return;
  }

  const functions = getSavedFunctions();

  if (isNewFunctionMode) {
    // NEW FUNCTION MODE: Always prompt for name, check if name exists
    const name = prompt('Enter a name for this function:');
    if (!name || name.trim() === '') {
      showPopup('Function name cannot be empty.', 'error');
      return;
    }

    const trimmedName = name.trim();
    if (functions[trimmedName]) {
      // Name already exists, ask for replacement
      if (!confirm(`Function "${trimmedName}" already exists. Replace it?`)) {
        return;
      }
    }

    // Save with the new name
    const funcData = {
      function: currentFunction,
      xMin: document.getElementById('xMin').value,
      xMax: document.getElementById('xMax').value,
      yMin: document.getElementById('yMin').value,
      yMax: document.getElementById('yMax').value
    };

    saveFunction(trimmedName, funcData);
    showPopup(`Function "${trimmedName}" saved successfully.`, 'success');
    isNewFunctionMode = false; // Reset mode after saving

  } else {
    // MODIFY FUNCTION MODE: Ask to replace currently selected function
    const selectedName = functionList.value;
    if (!selectedName) {
      showPopup('Please select a function to modify first.', 'error');
      return;
    }

    if (!confirm(`Replace function "${selectedName}" with current function and settings?`)) {
      return;
    }

    // Replace the selected function
    const funcData = {
      function: currentFunction,
      xMin: document.getElementById('xMin').value,
      xMax: document.getElementById('xMax').value,
      yMin: document.getElementById('yMin').value,
      yMax: document.getElementById('yMax').value
    };

    saveFunction(selectedName, funcData);
    showPopup(`Function "${selectedName}" updated successfully.`, 'success');
  }
}

/**
 * Handle new function creation
 */
function handleNewFunction() {
  isNewFunctionMode = true; // We're now in new function mode
  
  // Clear the function input
  document.getElementById('functionInput').value = '';
  
  // Reset range values to defaults
  document.getElementById('xMin').value = '-5';
  document.getElementById('xMax').value = '5';
  document.getElementById('yMin').value = '-5';
  document.getElementById('yMax').value = '5';
  
  // Clear any current plot (show flat surface at z=0)
  updateSurface((x, y) => 0, -5, 5, -5, 5);
  
  // Deselect any function in the list
  functionList.value = '';
  
  showPopup('Ready to create a new function.', 'info');
}

/**
 * Handle function deletion
 */
function handleFunctionDelete() {
  const selectedName = functionList.value;
  if (!selectedName) {
    showPopup('Please select a function to delete.', 'error');
    return;
  }

  // Prevent deletion of default functions
  if (selectedName.startsWith('default_')) {
    showPopup('Cannot delete built-in functions.', 'warning');
    return;
  }

  if (confirm(`Are you sure you want to delete "${selectedName}"?`)) {
    deleteFunction(selectedName);
    showPopup(`Function "${selectedName}" deleted.`, 'success');
  }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboard(e) {
  // Ctrl+S to save
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    saveFunctionBtn.click();
  }
  // Ctrl+R to reset view
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    resetBtn.click();
  }
  // ? to show help
  if (e.key === '?') {
    e.preventDefault();
    helpBtn.click();
  }
  // Enter in function input to plot
  if (e.target.id === 'functionInput' && e.key === 'Enter') {
    e.preventDefault();
    handlePlot();
  }
}

/**
 * Function management utilities
 */
function getSavedFunctions() {
  const saved = localStorage.getItem('xgraphix_functions');
  return saved ? JSON.parse(saved) : {};
}

function saveFunction(name, funcData) {
  const functions = getSavedFunctions();
  functions[name] = funcData;
  localStorage.setItem('xgraphix_functions', JSON.stringify(functions));
  updateFunctionList();
}

function loadFunction(name) {
  const functions = getSavedFunctions();
  return functions[name];
}

function deleteFunction(name) {
  const functions = getSavedFunctions();
  delete functions[name];
  localStorage.setItem('xgraphix_functions', JSON.stringify(functions));
  updateFunctionList();
}

function updateFunctionList() {
  const functions = getSavedFunctions();
  
  // Default common functions
  const defaultFunctions = {
    'Paraboloid': {
      function: 'x*x + y*y',
      xMin: '-2',
      xMax: '2',
      yMin: '-2',
      yMax: '2'
    },
    'Sine Wave': {
      function: 'Math.sin(x) * Math.cos(y)',
      xMin: '-3.14',
      xMax: '3.14',
      yMin: '-3.14',
      yMax: '3.14'
    },
    'Gaussian': {
      function: 'Math.exp(-(x*x + y*y))',
      xMin: '-2',
      xMax: '2',
      yMin: '-2',
      yMax: '2'
    },
    'Ripple': {
      function: 'Math.sin(Math.sqrt(x*x + y*y))',
      xMin: '-6.28',
      xMax: '6.28',
      yMin: '-6.28',
      yMax: '6.28'
    }
  };
  
  functionList.innerHTML = '<option value="">Select a function...</option>';
  
  // Add default functions first
  Object.keys(defaultFunctions).forEach(name => {
    const option = document.createElement('option');
    option.value = `default_${name}`;
    option.textContent = `★ ${name}`;
    option.style.fontWeight = 'bold';
    option.style.color = '#2563eb';
    functionList.appendChild(option);
  });
  
  // Add separator if there are saved functions
  if (Object.keys(functions).length > 0) {
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '────────── Your Functions ──────────';
    separator.style.fontSize = '12px';
    separator.style.color = '#6b7280';
    functionList.appendChild(separator);
  }

  // Add saved functions
  Object.keys(functions).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    functionList.appendChild(option);
  });
}

/**
 * UI feedback functions
 */
function showPopup(message, type = 'success') {
  const popup = document.getElementById('popup');
  const content = document.querySelector('.popup-content');
  const messageEl = document.getElementById('popup-message');
  
  // Remove any existing type classes
  content.classList.remove('error', 'info', 'warning', 'success');
  
  // Add the appropriate type class
  content.classList.add(type);
  
  messageEl.textContent = message;
  popup.style.display = 'block';

  // Auto-hide after 3 seconds
  setTimeout(() => {
    hidePopup();
  }, 3000);
}

function hidePopup() {
  document.getElementById('popup').style.display = 'none';
}

function showLoading() {
  loadingIndicator.style.display = 'flex';
}

function hideLoading() {
  loadingIndicator.style.display = 'none';
}

// Initialize popup close handler
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.popup-close')?.addEventListener('click', hidePopup);
});