# 3D Function Plotter

A sophisticated interactive 3D mathematical function visualizer built with Three.js, featuring real-time rendering, intuitive controls, and comprehensive mathematical plotting capabilities.

![3D Function Plotter](https://via.placeholder.com/800x400/3498db/ffffff?text=3D+Function+Plotter)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [User Guide](#-user-guide)
- [Technical Documentation](#-technical-documentation)
- [API Reference](#-api-reference)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Real-time 3D Visualization**: Plot mathematical functions in 3D space with smooth wireframe rendering
- **Interactive Controls**: Orbit controls for camera manipulation (rotate, zoom, pan)
- **Customizable Functions**: Input any JavaScript mathematical expression for the Z-axis
- **Dynamic Range Settings**: Adjust X and Y axis ranges to focus on specific domains

### 🎨 User Interface
- **Modern Design**: Glassmorphism UI with backdrop blur effects
- **Burger Menu**: Collapsible controls panel for clean interface
- **Color-coded Popups**: Success (green), error (red), warning (orange), info (blue) messages
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Touch-friendly**: Enhanced mobile interactions with larger touch targets

### 📊 Visual Features
- **Coordinate System**: Labeled axes with numerical markers
- **Grid Overlay**: Customizable reference grid
- **Wireframe Rendering**: Clean mathematical surface visualization
- **Smooth Animations**: CSS transitions and Three.js animations

### 🔧 Advanced Features
- **Function Library**: Save and manage frequently used functions
- **Error Handling**: Intelligent validation with contextual error messages
- **Performance Optimized**: Efficient rendering for complex functions
- **Keyboard Shortcuts**: Quick access to common actions

## 🚀 Quick Start

### Prerequisites
- **Browser**: Modern browser with WebGL support (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- **Python**: Version 3.x for local development server
- **WebGL**: Enabled in browser settings

### Installation

```bash
# Clone the repository
git clone https://github.com/mrodriguex/xgraphx.git
cd xgraphx

# Start development server
python3 -m http.server 8000

# Open in browser
# Navigate to: http://localhost:8000
```

### First Plot
1. Open `http://localhost:8000` in your browser
2. Enter `x*x + y*y` in the function input
3. Click the **Plot** button
4. Use mouse to rotate the 3D view

## 📖 User Guide

### Interface Overview

The application features a clean, modern interface with three main components:

- **3D Canvas**: Main visualization area (center)
- **Burger Menu**: Controls toggle (top-left corner)
- **Action Buttons**: Help (?) and Reset (⟲) buttons (top-right corner)

### Function Input

#### Basic Syntax
- **Variables**: `x` and `y` (case-sensitive)
- **Operators**: `+`, `-`, `*`, `/`, `**` (power), `%` (modulo)
- **Parentheses**: Use `()` for grouping expressions

#### Mathematical Functions
```javascript
// Trigonometric
Math.sin(x), Math.cos(x), Math.tan(x)
Math.asin(x), Math.acos(x), Math.atan(x)

// Exponential & Logarithmic
Math.exp(x), Math.log(x), Math.log10(x)

// Power & Root
Math.pow(x, y), Math.sqrt(x), x**(1/3)

// Rounding
Math.floor(x), Math.ceil(x), Math.round(x)

// Absolute & Sign
Math.abs(x), Math.sign(x)

// Constants
Math.PI, Math.E
```

#### Advanced Examples
```javascript
// Saddle surface
x*x - y*y

// Ripple effect with distance
Math.sin(Math.sqrt(x*x + y*y) * 2)

// Gaussian bell curve
Math.exp(-(x*x + y*y) / 2)

// Torus approximation
Math.sin(x) * Math.cos(y) * 2

// Möbius strip approximation
Math.sin(x) * Math.sin(y/2)
```

### Range Settings

Control the plotting domain by adjusting X and Y ranges:

- **Default Range**: -2 to +2 for both axes
- **Recommended**: Keep ranges symmetric for best visualization
- **Performance**: Smaller ranges = faster rendering
- **Precision**: Larger ranges may need more grid points

### Display Options

#### Grid Toggle
- **Show Grid**: Reference grid for spatial orientation
- **Performance**: Disable for complex functions

#### Number Labels
- **Show Numbers**: Axis coordinate labels
- **Clarity**: Enable for educational use, disable for clean visualization

### Camera Controls

#### Desktop Controls
| Action | Input | Description |
|--------|-------|-------------|
| Rotate | Left-click + drag | Orbit around center point |
| Zoom | Mouse wheel | Zoom in/out |
| Pan | Middle-click + drag | Move camera position |
| Reset View | Right-click menu | Return to default position |

#### Mobile/Touch Controls
| Action | Gesture | Description |
|--------|---------|-------------|
| Rotate | 1 finger drag | Orbit around visualization |
| Zoom | Pinch | Zoom in/out |
| Pan | 2 finger drag | Move camera position |

### Function Library

#### Saving Functions
1. Enter your function in the input field
2. Click the **Save** button
3. Provide a descriptive name
4. Function appears in the dropdown list

#### Managing Functions
- **Load**: Select from dropdown to load saved function
- **Delete**: Remove unwanted saved functions
- **New**: Clear current function for fresh input

### Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Enter` | Plot Function | Execute current function |
| `Ctrl+S` | Save Function | Open save dialog |
| `Ctrl+R` | Reset View | Return camera to default |
| `F1` | Help | Show help modal |
| `Esc` | Close Modals | Close any open dialogs |

## 🔧 Technical Documentation

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   index.html    │    │   controls.js   │    │    plotter.js   │
│                 │    │                 │    │                 │
│ • DOM Structure │    │ • UI Management │    │ • Three.js      │
│ • Event Binding │    │ • State Control │    │ • Scene Mgmt    │
│ • Canvas Setup  │    │ • Validation    │    │ • Rendering     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   style.css    │
                    │                 │
                    │ • Layout        │
                    │ • Animations    │
                    │ • Responsive    │
                    └─────────────────┘
```

### Core Components

#### Three.js Scene Management
- **Renderer**: WebGL context with antialiasing
- **Camera**: Perspective camera with orbit controls
- **Scene**: 3D object container with lighting
- **Geometry**: Parametric surface generation
- **Materials**: Wireframe and solid surface materials

#### Function Evaluation
- **Parser**: JavaScript `Function` constructor for dynamic evaluation
- **Validation**: Syntax checking and error handling
- **Sampling**: Grid-based point evaluation
- **Performance**: Optimized computation with caching

#### UI State Management
- **Controls Panel**: Collapsible settings interface
- **Popup System**: Color-coded user feedback
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation

### Performance Optimization

#### Rendering Optimizations
- **LOD (Level of Detail)**: Adaptive mesh resolution
- **Frustum Culling**: Hide objects outside camera view
- **Object Pooling**: Reuse geometry and materials
- **Efficient Updates**: Minimal scene graph modifications

#### Memory Management
- **Garbage Collection**: Proper cleanup of Three.js objects
- **Texture Compression**: Optimized image loading
- **Lazy Loading**: On-demand resource loading

#### Browser Compatibility
- **WebGL Detection**: Fallback for unsupported browsers
- **Feature Detection**: Progressive enhancement
- **Polyfills**: ES6+ compatibility for older browsers

### File Structure Details

```
xgraphx/
├── index.html                 # Main application shell
│   ├── Canvas setup          # WebGL context initialization
│   ├── UI components         # HTML structure for controls
│   └── Event bindings        # User interaction handlers
│
├── assets/
│   ├── css/
│   │   └── style.css         # Complete styling system
│   │       ├── Layout        # Grid and flexbox layouts
│   │       ├── Components    # Button, input, modal styles
│   │       ├── Animations    # Transitions and keyframes
│   │       └── Responsive    # Mobile-first breakpoints
│   │
│   └── js/
│       ├── main.js           # Application entry point
│       │   ├── Module imports
│       │   ├── DOM ready handler
│       │   └── Component initialization
│       │
│       ├── controls.js       # UI control logic
│       │   ├── Event handlers
│       │   ├── State management
│       │   ├── Validation
│       │   └── User feedback
│       │
│       └── plotter.js        # Three.js visualization
│           ├── Scene setup
│           ├── Geometry generation
│           ├── Camera controls
│           └── Rendering loop
│
├── .vscode/
│   └── launch.json           # Development configurations
│
├── .gitignore               # Version control exclusions
├── LICENSE                  # MIT license terms
└── README.md               # This documentation
```

## 📚 API Reference

### Function Plotting API

#### plotFunction(expression, options)
Renders a 3D surface from a mathematical expression.

**Parameters:**
- `expression` (string): Mathematical function as JavaScript code
- `options` (object): Rendering configuration
  - `xMin`, `xMax` (number): X-axis range
  - `yMin`, `yMax` (number): Y-axis range
  - `gridSize` (number): Resolution of the mesh
  - `wireframe` (boolean): Wireframe vs solid rendering

**Returns:** Promise that resolves when rendering completes

**Example:**
```javascript
plotFunction("Math.sin(x) * Math.cos(y)", {
  xMin: -Math.PI,
  xMax: Math.PI,
  yMin: -Math.PI,
  yMax: Math.PI,
  gridSize: 50,
  wireframe: true
});
```

### Camera Controls API

#### resetCamera()
Resets camera to default position and orientation.

#### setCameraPosition(x, y, z)
Sets camera position in 3D space.

**Parameters:**
- `x`, `y`, `z` (number): World coordinates

#### setCameraTarget(x, y, z)
Sets camera look-at target.

### UI Management API

#### showPopup(message, type, duration)
Displays a user notification.

**Parameters:**
- `message` (string): Notification text
- `type` (string): "success", "error", "warning", "info"
- `duration` (number): Auto-hide delay in milliseconds

#### toggleControls()
Shows/hides the controls panel.

#### updateRange(axis, min, max)
Updates plotting range for specified axis.

## 💻 Development

### Development Setup

#### VS Code Configuration
1. Install recommended extensions:
   - Live Server
   - Three.js Snippets
   - JavaScript (ES6) code snippets

2. Launch configurations available:
   - **Launch 3D Plotter**: Opens in default browser
   - **Debug Mode**: Enables browser developer tools

#### Manual Setup
```bash
# Install dependencies (none required for basic development)
# Start development server
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

### Code Quality

#### Linting
```bash
# Install ESLint globally
npm install -g eslint

# Run linting
eslint assets/js/*.js
```

#### Testing
```bash
# Manual testing checklist:
# - Function plotting accuracy
# - UI responsiveness
# - Mobile compatibility
# - Error handling
# - Performance benchmarks
```

### Building Features

#### Adding New Functions
1. Extend the function parser in `plotter.js`
2. Add validation rules in `controls.js`
3. Update documentation

#### UI Enhancements
1. Modify `style.css` for styling changes
2. Update `index.html` for structure changes
3. Test across all breakpoints

#### Performance Improvements
1. Profile rendering performance
2. Optimize geometry generation
3. Implement caching strategies

### Version Control

#### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical fixes

#### Commit Conventions
```
feat: add new plotting function
fix: resolve mobile layout issue
docs: update API documentation
style: format code with Prettier
refactor: optimize rendering performance
test: add unit tests for validation
```

## 🚀 Deployment

### Static Hosting

The application is static and can be deployed to any web server:

#### GitHub Pages
```bash
# Create gh-pages branch
git checkout -b gh-pages

# Build and deploy
npm run deploy  # or manual upload
```

#### Netlify/Vercel
1. Connect repository
2. Set build command: `echo "Static site - no build needed"`
3. Set publish directory: `/`
4. Deploy

#### Traditional Hosting
```bash
# Upload files via FTP
ftp example.com
cd public_html
put -r xgraphx/
```

### CDN Optimization

#### Asset Optimization
```bash
# Minify CSS
npx postcss assets/css/style.css -o assets/css/style.min.css --use cssnano

# Minify JavaScript
npx terser assets/js/*.js -o assets/js/bundle.min.js
```

#### Compression
Configure server for:
- GZIP compression for HTML/CSS/JS
- WebP images (if applicable)
- Brotli compression for modern browsers

### Performance Monitoring

#### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

#### Monitoring Tools
- Google PageSpeed Insights
- WebPageTest
- Chrome DevTools Performance tab

## 🔍 Troubleshooting

### Common Issues & Solutions

#### WebGL Context Lost
**Symptoms:** Black screen, "WebGL context lost" error
**Solutions:**
- Refresh the page
- Restart browser
- Update graphics drivers
- Disable hardware acceleration in browser settings

#### Function Parsing Errors
**Symptoms:** "Invalid function" popup messages
**Common Causes:**
- Missing `Math.` prefix: Use `Math.sin(x)`, not `sin(x)`
- Undefined variables: Only `x` and `y` are available
- Syntax errors: Check parentheses and operators
- Reserved words: Avoid using `function`, `var`, etc.

#### Performance Issues
**Symptoms:** Slow rendering, browser freezing
**Solutions:**
- Reduce range values (smaller domains)
- Decrease grid resolution
- Close other browser tabs
- Update browser to latest version
- Enable hardware acceleration

#### Mobile Touch Issues
**Symptoms:** Unresponsive touch controls
**Solutions:**
- Ensure viewport meta tag is present
- Check for conflicting CSS touch events
- Test on actual mobile device (not just browser dev tools)

#### Loading Errors
**Symptoms:** "Failed to load resource" errors
**Solutions:**
- Check file paths and permissions
- Ensure development server is running
- Verify CORS settings for external resources
- Clear browser cache

### Debug Mode

Enable debug logging:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
location.reload();
```

### Browser-Specific Issues

#### Chrome/Chromium
- Enable WebGL: `chrome://flags/#enable-webgl-draft-extensions`
- Hardware acceleration: `chrome://settings/?search=hardware+acceleration`

#### Firefox
- WebGL: `about:config` → `webgl.force-enabled` → `true`
- Performance: `about:config` → `dom.webgl.max_frames_per_second` → `60`

#### Safari
- WebGL: Develop menu → Experimental Features → WebGL 2.0
- Performance: Develop menu → Experimental Features → GPU Process: WebGL

### Getting Help

1. **Check Documentation**: Review this comprehensive README
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Verify all resources load correctly
4. **Performance Tab**: Identify bottlenecks
5. **Create Issue**: Use GitHub issues for bugs/features

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/xgraphx.git`
3. **Create** feature branch: `git checkout -b feature/amazing-feature`
4. **Make** changes and test thoroughly
5. **Commit** with clear messages: `git commit -m 'Add amazing feature'`
6. **Push** to branch: `git push origin feature/amazing-feature`
7. **Create** Pull Request with detailed description

### Code Standards

#### JavaScript
- Use ES6+ features (const/let, arrow functions, template literals)
- Consistent naming: camelCase for variables/functions
- JSDoc comments for functions
- Error handling with try/catch
- Modular code organization

#### CSS
- BEM methodology for class naming
- CSS custom properties for theming
- Mobile-first responsive design
- Optimized animations and transitions

#### HTML
- Semantic HTML5 elements
- Accessibility attributes (ARIA labels)
- Clean, minimal markup
- Progressive enhancement

### Testing Checklist

#### Functionality
- [ ] Function plotting works correctly
- [ ] Camera controls respond properly
- [ ] UI elements are interactive
- [ ] Error handling provides helpful messages

#### Compatibility
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Different screen sizes and orientations
- [ ] Touch and mouse interactions

#### Performance
- [ ] Initial load time < 3 seconds
- [ ] Smooth 60fps rendering
- [ ] Memory usage remains stable
- [ ] No console errors or warnings

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Screenshots
Add screenshots if UI changes

## Additional Notes
Any additional information or context
```

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

### GPL v3 License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ✅ Patent use
- ❌ Liability
- ❌ Warranty
- ⚠️ **Copyleft**: Derivative works must also be GPL v3 licensed

## 🙏 Acknowledgments

### Core Technologies
- **[Three.js](https://threejs.org/)**: Powerful 3D graphics library
- **[OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)**: Intuitive camera controls
- **[WebGL](https://get.webgl.org/)**: Hardware-accelerated 3D graphics

### Development Tools
- **VS Code**: Primary development environment
- **Git**: Version control system
- **Python HTTP Server**: Local development server
- **Browser DevTools**: Debugging and profiling

### Community
- **Three.js Community**: Excellent documentation and examples
- **Stack Overflow**: Invaluable problem-solving resource
- **GitHub Community**: Open source collaboration

### Inspiration
- Mathematical visualization tools
- Modern web application design patterns
- Educational software for STEM learning

---

## 📞 Support

### Getting Help
- **Documentation**: This comprehensive README
- **Issues**: [GitHub Issues](https://github.com/mrodriguex/xgraphx/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mrodriguex/xgraphx/discussions)

### Contact Information
- **Maintainer**: mrodriguex
- **Email**: manuel.r.camacho@outlook.com
- **GitHub**: [@mrodriguex](https://github.com/mrodriguex)
- **Repository**: [GitHub Repository](https://github.com/mrodriguex/xgraphx)

---

**Built using Three.js and modern web technologies**