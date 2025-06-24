# gemini-live-websocket-proxy

## Overview
This project is a websocket proxy server built with TypeScript, using `ws` for websocket handling and `dotenv` for environment variable management.

## Prerequisites
- Node.js (version 16 or higher recommended)
- npm

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gemini-live-websocket-proxy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory to define any necessary environment variables. The project uses `dotenv` to load environment variables automatically.

## Running the Project

### Development Mode

This mode uses `nodemon` and `ts-node` to enable automatic restart on changes and directly running TypeScript files.

```bash
npm run dev
```

### Production Mode

Build the project first using TypeScript compiler, then run the compiled JavaScript file using Node.js with environment variables loaded.

```bash
npm run build
npm start
```

## Project Structure

- `src/` - Contains the TypeScript source files
- `dist/` - Contains the compiled JavaScript files after build
- `.env` - Environment variables file (should be created by the user)

## Notes

- Make sure to define all necessary environment variables in your `.env` file.
- The main entry point is `src/app.ts`.
- Adjust the scripts or configurations as needed for your deployment environment.

## Dependencies

- `ws` - Websocket library
- `dotenv` - Environment variable loader
- `ts-node` - TypeScript execution environment for Node.js during development
- `nodemon` - Automatically restarts Node.js server on code changes during development
- `typescript` - Language compiler

---

If you encounter any issues or need help running the project, please check configurations or consult the source code comments.
