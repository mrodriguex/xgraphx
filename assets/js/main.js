import { initPlotter } from './plotter.js';
import { initControls } from './controls.js';

/**
 * Main application entry point
 * Initializes the 3D function plotter and user controls
 */
function init() {
  const canvas = document.getElementById("scene");

  // Initialize the 3D plotting system
  initPlotter(canvas);

  // Initialize user interface controls
  initControls();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
