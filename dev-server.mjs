import { createServer } from 'vite';

async function start() {
  const server = await createServer({
    server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: false,
    },
  });
  await server.listen();
  server.printUrls();
  setInterval(() => {}, 1 << 30);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
