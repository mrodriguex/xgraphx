# 3D Function Plotter

A interactive 3D mathematical function visualizer built with Three.js, allowing users to plot and explore 3D surfaces in real-time.

![3D Function Plotter](https://via.placeholder.com/800x400/3498db/ffffff?text=3D+Function+Plotter)

## Repository

- **Repository**: [GitHub Repository](https://github.com/username/xgraphix)
- **Issues**: [Report Issues](https://github.com/username/xgraphix/issues)
- **Documentation**: [Wiki](https://github.com/username/xgraphix/wiki)

## Maintainer

- **Name**: Manuel
- **Email**: manuel@example.com
- **GitHub**: [@manueldev](https://github.com/manueldev)
- **LinkedIn**: [Manuel Developer](https://linkedin.com/in/manueldev)

## Features

- **Real-time 3D Visualization**: Plot mathematical functions in 3D space with smooth wireframe rendering
- **Interactive Controls**: Orbit controls for camera manipulation (rotate, zoom, pan)
- **Customizable Functions**: Input any JavaScript mathematical expression for the Z-axis
- **Dynamic Range Settings**: Adjust X and Y axis ranges to focus on specific domains
- **Visual Aids**:
  - Coordinate axes with labeled tick marks
  - Adjustable grid overlay
  - Negative axis extensions
- **Responsive Design**: Optimized for desktop and mobile devices with touch controls
- **User-friendly Interface**: Clean controls panel with show/hide toggle
- **Error Handling**: Intelligent validation with user-friendly error messages

## Technologies Used

- **Three.js**: 3D graphics and WebGL rendering
- **JavaScript (ES6+)**: Core application logic
- **HTML5/CSS3**: User interface and responsive design
- **Python HTTP Server**: Local development server

## Prerequisites

- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd xgraphix
   ```

2. **Start the development server**:
   - **Option 1: Using VS Code** (Recommended)
     - Open the project in VS Code
     - Go to Run & Debug (Ctrl+Shift+D)
     - Select "Launch 3D Plotter" from the configuration dropdown
     - Click the green play button
   - **Option 2: Manual terminal**:
     ```bash
     python3 -m http.server 5500
     ```

3. **Open in browser**:
   - Navigate to `http://localhost:5500/index.html`
   - Or use the VS Code launch configuration to open automatically

## Usage

### Basic Plotting

1. Enter a mathematical function in the "Function f(x,y)" field
2. Click "Plot" to render the 3D surface
3. Use mouse/touch to orbit around the visualization

### Function Examples

- `x*x + y*y` - Paraboloid
- `Math.sin(x) * Math.cos(y)` - Wave pattern
- `Math.sqrt(x*x + y*y)` - Cone
- `Math.exp(-(x*x + y*y))` - Gaussian distribution
- `Math.sin(Math.sqrt(x*x + y*y))` - Ripple effect

### Range Controls

- **X Range**: Set minimum and maximum X values
- **Y Range**: Set minimum and maximum Y values
- Ranges automatically update the grid and axis labels

### Display Options

- **Show Grid**: Toggle the ground reference grid
- **Show Axes Numbers**: Toggle numerical axis labels
- **Controls Toggle**: Click the ⚙️ button to show/hide the control panel

### Camera Controls

- **Desktop**:
  - **Rotate**: Left-click and drag
  - **Zoom**: Mouse wheel or right-click drag
  - **Pan**: Middle-click drag or Shift+left-click

- **Mobile/Touch**:
  - **Rotate**: Single finger drag
  - **Zoom**: Pinch gesture
  - **Pan**: Two-finger drag

## Project Structure

```
xgraphix/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # Stylesheets
│   └── js/
│       └── main.js         # Three.js application
├── .vscode/
│   └── launch.json         # VS Code launch configurations
├── .gitignore              # Git ignore rules
└── README.md              # This file
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile) with WebGL support

## Development

### Adding New Features

1. Modify `main.js` for Three.js logic
2. Update `style.css` for UI changes
3. Edit `index.html` for structure changes

### Building for Production

The application is static and ready for deployment. Simply upload the files to any web server.

## Troubleshooting

### Common Issues

**"ERR_CONNECTION_REFUSED"**
- Ensure the Python HTTP server is running on port 5500
- Check that no other service is using the port

**"Invalid function" errors**
- Use valid JavaScript Math functions
- Ensure proper syntax: `Math.sin(x)`, not `sin(x)`
- Check for undefined variables

**Performance issues**
- Reduce grid size or range for better performance
- Close other browser tabs

### Function Syntax

- Use `x` and `y` as variables
- Math functions: `Math.sin()`, `Math.cos()`, `Math.sqrt()`, etc.
- Operators: `+`, `-`, `*`, `/`, `**` (power)
- Constants: `Math.PI`, `Math.E`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) - Camera controls
- [Helvetiker Font](https://threejs.org/examples/fonts/helvetiker_regular.typeface.json) - 3D text rendering

## Screenshots

### Main Interface
*Clean, intuitive interface with collapsible controls*

### 3D Visualization
*Interactive 3D surface plotting with grid and axes*

### Mobile Responsive
*Touch-optimized controls for mobile devices with responsive layout*

---

**Created with ❤️ using Three.js**