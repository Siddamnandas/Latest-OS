// server.ts
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { socketAuthMiddleware, originGuard } from "./src/lib/realtime/socketAuth";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((req, res) => handle(req, res));

const io = new Server(httpServer, {
  cors: {
    origin: originGuard,  // dynamic allowlist
    credentials: true
  },
});

io.use(socketAuthMiddleware); // token + origin validation

io.on("connection", (socket) => {
  // Your events here
  socket.emit("ready", { ok: true });
});

const port = Number(process.env.PORT) || 3000;
httpServer.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});
