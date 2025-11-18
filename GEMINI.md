# Project Overview

This project is a modern, single-page application (SPA) for "Carrocerias RMS", a company that likely manufactures or sells truck bodies. The application serves as a landing page and product showcase.

## Technologies

- **Framework:** Angular (v20)
- **Styling:** Tailwind CSS with daisyUI component library
- **3D Rendering:** three.js for displaying 3D models of their products
- **Build Tool:** Angular CLI

## Architecture

The application is built using Angular's standalone components, which is the modern, recommended way of building Angular applications. The main `App` component is composed of several feature components, each responsible for a specific section of the landing page. Some of these components are lazy-loaded using `@defer` to improve initial page load performance.

The project is structured with a clear separation of concerns, with feature components located in the `src/app/features` directory.

# Building and Running

## Development Server

To start the development server, run the following command:

```bash
npm start
```

This will start a local development server at `http://localhost:4200/`.

## Build

To build the project for production, run the following command:

```bash
npm run build
```

The build artifacts will be stored in the `dist/carrocerias-rms/` directory.

## Testing

To run the unit tests, run the following command:

```bash
npm test
```

# Development Conventions

- **Styling:** The project uses Tailwind CSS for utility-first styling and daisyUI for pre-built components.
- **3D Models:** 3D models are stored in the `src/assets/models/3d` directory in `.glb` format. The `Model3d` component is responsible for loading and displaying these models.
- **Components:** Components are built as standalone components and are located in the `src/app/features` directory. Each component has its own directory containing the component's TypeScript, HTML, and CSS files.
