import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js";

const canvas = document.getElementById("scene");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(3, 3, 3);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff); // Light background

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

new OrbitControls(camera, renderer.domElement);

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

// Global variables for dynamic elements
let xNumbers = [], yNumbers = [], zNumbers = [];
let font;
const numberMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const positions = [-2, -1, 0, 1, 2];
let showGrid = true;
let showNumbers = true;
let minZ = 0, maxZ = 0;

// Load font and create axis labels
const fontLoader = new FontLoader();
fontLoader.load(
  'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',
  (loadedFont) => {
    font = loadedFont;
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black text for light background

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
    positions.forEach(scenePos => {
      // X axis numbers
      const xVal = scenePos.toFixed(1);
      const xNumGeom = new TextGeometry(xVal, { font: font, size: 0.1, height: 0.01 });
      const xNum = new THREE.Mesh(xNumGeom, numberMaterial);
      xNum.position.set(scenePos, 0, -0.1);
      scene.add(xNum);
      xNumbers.push(xNum);

      // Y axis numbers
      const yVal = scenePos.toFixed(1);
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
    
    // Set initial visibility
    xNumbers.forEach(m => m.visible = showNumbers);
    yNumbers.forEach(m => m.visible = showNumbers);
    zNumbers.forEach(m => m.visible = showNumbers);
  }
);

/* Surface */
const size = 40;
const geometry = new THREE.PlaneGeometry(4, 4, size, size);

function updateSurface(func, xMin, xMax, yMin, yMax) {
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
}

const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshLambertMaterial({ color: 0x0088ff, side: THREE.DoubleSide, wireframe: true })
);
scene.add(mesh);

// Initial surface
updateSurface((x, y) => x * x + y * y, -2, 2, -2, 2);

// Initial grid
let gridHelper = new THREE.GridHelper(4, 10, 0xcccccc, 0x888888);
gridHelper.visible = showGrid;
scene.add(gridHelper);

// Controls
document.getElementById('updateButton').addEventListener('click', () => {
  const funcStr = document.getElementById('functionInput').value;
  const xMin = parseFloat(document.getElementById('xMin').value);
  const xMax = parseFloat(document.getElementById('xMax').value);
  const yMin = parseFloat(document.getElementById('yMin').value);
  const yMax = parseFloat(document.getElementById('yMax').value);
  
  if (xMin >= xMax || yMin >= yMax) {
    showPopup('Minimum values must be less than maximum values.');
    return;
  }
  
  try {
    const func = new Function('x', 'y', `return ${funcStr};`);
    // Test the function with sample values
    func((xMin + xMax) / 2, (yMin + yMax) / 2);
    updateSurface(func, xMin, xMax, yMin, yMax);
    
    // Update grid helper to match the new ranges
    scene.remove(gridHelper);
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const gridSize = Math.max(xRange, yRange);
    gridHelper = new THREE.GridHelper(gridSize, 10, 0xcccccc, 0x888888);
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    
    // Update number labels
    const xScale = (xMax - xMin) / 4;
    const xOffset = (xMax + xMin) / 2;
    const yScale = (yMax - yMin) / 4;
    const yOffset = (yMax + yMin) / 2;
    
    // Remove old numbers
    xNumbers.forEach(mesh => scene.remove(mesh));
    yNumbers.forEach(mesh => scene.remove(mesh));
    zNumbers.forEach(mesh => scene.remove(mesh));
    xNumbers = [];
    yNumbers = [];
    zNumbers = [];
    
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
  } catch (error) {
    showPopup('Invalid function: ' + error.message);
  }
});

/* Visibility controls */
document.getElementById('toggleControls').addEventListener('click', () => {
  const controls = document.getElementById('controls');
  controls.classList.toggle('hidden');
});

document.getElementById('showGrid').addEventListener('change', (e) => {
  showGrid = e.target.checked;
  gridHelper.visible = showGrid;
});

document.getElementById('showNumbers').addEventListener('change', (e) => {
  showNumbers = e.target.checked;
  xNumbers.forEach(m => m.visible = showNumbers);
  yNumbers.forEach(m => m.visible = showNumbers);
  zNumbers.forEach(m => m.visible = showNumbers);
});

/* Popup functions */
function showPopup(message) {
  const popup = document.getElementById('popup');
  const messageEl = document.getElementById('popup-message');
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

// Close popup on click
document.querySelector('.popup-close').addEventListener('click', hidePopup);

/* render loop */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
