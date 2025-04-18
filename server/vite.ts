import express from 'express';
import { createServer } from 'http';
import path from 'path';

export const log = (message: string) => {
  console.log(`${new Date().toLocaleTimeString()} [express] ${message}`);
};

export const serveStatic = (app: express.Application) => {
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));
};

export const setupVite = async (app: express.Application, server: any) => {
  if (process.env.NODE_ENV === 'development') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      root: path.join(__dirname, '../client'),
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }
};