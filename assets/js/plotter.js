import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js";

// Global variables for plotting
let scene, camera, renderer, controls;
let xNumbers = [], yNumbers = [], zNumbers = [];
let font, gridHelper;
let showGrid = true;
let showNumbers = true;
let minZ = 0, maxZ = 0;

// Surface geometry and mesh
const size = 40;
const geometry = new THREE.PlaneGeometry(4, 4, size, size);
const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshLambertMaterial({ color: 0x0088ff, side: THREE.DoubleSide, wireframe: true })
);

const positions = [-2, -1, 0, 1, 2];
const numberMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

/**
 * Initialize the 3D plotting scene
 */
export function initPlotter(canvas) {
  // Scene setup
  scene = new THREE.Scene();

  // Camera setup
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(3, 3, 3);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0xffffff); // Light background

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);

  // Add axes
  scene.add(new THREE.AxesHelper(2));

  // Add negative axes
  const axesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const xNegGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(-2,0,0)]);
  const xNeg = new THREE.Line(xNegGeometry, axesMaterial);
  scene.add(xNeg);
  const yNegGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,-2,0)]);
  const yNeg = new THREE.Line(yNegGeometry, axesMaterial);
  scene.add(yNeg);
  const zNegGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-2)]);
  const zNeg = new THREE.Line(zNegGeometry, axesMaterial);
  scene.add(zNeg);

  // Add surface mesh
  scene.add(mesh);

  // Load font and create axis labels
  loadFont();

  // Initial surface
  updateSurface((x, y) => x * x + y * y, -2, 2, -2, 2);

  // Grid is already created by updateSurface, no need to create it again
  // The updateGridAndLabels function handles grid creation

  // Start render loop
  animate();

  // Handle window resize
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

/**
 * Load font for axis labels
 */
function loadFont() {
  const fontLoader = new FontLoader();
  fontLoader.load(
    'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',
    (loadedFont) => {
      font = loadedFont;
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

      // X axis label
      const xGeometry = new TextGeometry('X', {
        font: font,
        size: 0.2,
        height: 0.02,
      });
      const xText = new THREE.Mesh(xGeometry, textMaterial);
      xText.position.set(2.5, 0, 0);
      scene.add(xText);

      // Y axis label
      const yGeometry = new TextGeometry('Y', {
        font: font,
        size: 0.2,
        height: 0.02,
      });
      const yText = new THREE.Mesh(yGeometry, textMaterial);
      yText.position.set(0, 2.5, 0);
      scene.add(yText);

      // Z axis label
      const zGeometry = new TextGeometry('Z', {
        font: font,
        size: 0.2,
        height: 0.02,
      });
      const zText = new THREE.Mesh(zGeometry, textMaterial);
      zText.position.set(0, 0, 2.5);
      scene.add(zText);

      // Create initial number labels
      createNumberLabels(-2, 2, -2, 2);
    }
  );
}

/**
 * Update the surface geometry with a new function
 */
export function updateSurface(func, xMin, xMax, yMin, yMax) {
  const pos = geometry.attributes.position;
  const xScale = (xMax - xMin) / 4;
  const xOffset = (xMax + xMin) / 2;
  const yScale = (yMax - yMin) / 4;
  const yOffset = (yMax + yMin) / 2;
  minZ = Infinity;
  maxZ = -Infinity;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) * xScale + xOffset;
    const y = pos.getY(i) * yScale + yOffset;
    const z = func(x, y);
    pos.setZ(i, z);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  geometry.computeVertexNormals();
  pos.needsUpdate = true;

  // Update grid and labels
  updateGridAndLabels(xMin, xMax, yMin, yMax);
}

/**
 * Update grid and axis number labels
 */
function updateGridAndLabels(xMin, xMax, yMin, yMax) {
  // Update grid helper with fixed size for consistency
  scene.remove(gridHelper);
  // Use a fixed grid size regardless of function range for consistent UX
  const gridSize = 8; // Fixed size that works well for most functions
  gridHelper = new THREE.GridHelper(gridSize, 10, 0xcccccc, 0x888888);
  gridHelper.visible = showGrid;
  scene.add(gridHelper);

  // Update number labels
  createNumberLabels(xMin, xMax, yMin, yMax);
}

/**
 * Create axis number labels
 */
function createNumberLabels(xMin, xMax, yMin, yMax) {
  if (!font) return;

  // Remove old numbers
  xNumbers.forEach(mesh => scene.remove(mesh));
  yNumbers.forEach(mesh => scene.remove(mesh));
  zNumbers.forEach(mesh => scene.remove(mesh));
  xNumbers = [];
  yNumbers = [];
  zNumbers = [];

  const xScale = (xMax - xMin) / 4;
  const xOffset = (xMax + xMin) / 2;
  const yScale = (yMax - yMin) / 4;
  const yOffset = (yMax + yMin) / 2;

  // Create new numbers
  positions.forEach(scenePos => {
    // X axis numbers
    const xVal = (scenePos * xScale + xOffset).toFixed(1);
    const xNumGeom = new TextGeometry(xVal, { font: font, size: 0.1, height: 0.01 });
    const xNum = new THREE.Mesh(xNumGeom, numberMaterial);
    xNum.position.set(scenePos, 0, -0.1);
    scene.add(xNum);
    xNumbers.push(xNum);

    // Y axis numbers
    const yVal = (scenePos * yScale + yOffset).toFixed(1);
    const yNumGeom = new TextGeometry(yVal, { font: font, size: 0.1, height: 0.01 });
    const yNum = new THREE.Mesh(yNumGeom, numberMaterial);
    yNum.position.set(0, scenePos, -0.1);
    scene.add(yNum);
    yNumbers.push(yNum);

    // Z axis numbers
    const zVal = scenePos.toFixed(1);
    const zNumGeom = new TextGeometry(zVal, { font: font, size: 0.1, height: 0.01 });
    const zNum = new THREE.Mesh(zNumGeom, numberMaterial);
    zNum.position.set(-0.1, 0, scenePos);
    scene.add(zNum);
    zNumbers.push(zNum);
  });

  // Set visibility
  xNumbers.forEach(m => m.visible = showNumbers);
  yNumbers.forEach(m => m.visible = showNumbers);
  zNumbers.forEach(m => m.visible = showNumbers);
}

/**
 * Set grid visibility
 */
export function setGridVisibility(visible) {
  showGrid = visible;
  if (gridHelper) {
    gridHelper.visible = showGrid;
  }
}

/**
 * Set axis numbers visibility
 */
export function setNumbersVisibility(visible) {
  showNumbers = visible;
  xNumbers.forEach(m => m.visible = showNumbers);
  yNumbers.forEach(m => m.visible = showNumbers);
  zNumbers.forEach(m => m.visible = showNumbers);
}

/**
 * Reset camera view
 */
export function resetView() {
  camera.position.set(3, 3, 3);
  camera.lookAt(0, 0, 0);
  controls.reset();
}

/**
 * Render loop
 */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}