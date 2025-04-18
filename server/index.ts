import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { createServer, Server } from "http";
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

const startServer = async () => {
  try {
    const server = createServer(app);

    // Setup Vite or static files first
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      const clientBuildPath = path.resolve(__dirname, '../client/dist');
      app.use(express.static(clientBuildPath));
    }

    // Register routes after static/vite setup
    await registerRoutes(app);

    const port = process.env.PORT || 3000;
    
    // Start the server and return a promise
    return new Promise<Server>((resolve) => {
      server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        resolve(server);
      });
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Immediately invoke startServer
(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();