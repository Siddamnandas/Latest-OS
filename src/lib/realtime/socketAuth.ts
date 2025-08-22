import type { ServerOptions } from "socket.io";
import type { Socket } from "socket.io";
import { jwtVerify } from "jose";

const ALLOWED = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

export function originGuard(origin: string | undefined, cb: (err: Error | null, ok?: boolean) => void) {
  // Allow same-origin or non-browser clients (no origin header) only in dev if you want
  if (!origin) return cb(new Error("Origin required"));
  if (ALLOWED.includes(origin)) return cb(null, true);
  return cb(new Error("CORS blocked"));
}

// Extract token from either auth payload or headers
function getToken(socket: Socket): string | null {
  const a = socket.handshake.auth?.token as string | undefined;
  if (a) return a.startsWith("Bearer ") ? a.slice(7) : a;

  // Some clients pass through headers
  const h = socket.handshake.headers["authorization"];
  if (typeof h === "string" && h.startsWith("Bearer ")) return h.slice(7);
  return null;
}

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    // Validate required environment variables on startup
    const issuer = process.env.WS_JWT_ISSUER;
    const audience = process.env.WS_JWT_AUDIENCE;
    const secretString = process.env.WS_JWT_SECRET;

    if (!issuer || !audience || !secretString) {
      console.error("Missing required JWT environment variables for WebSocket authentication.");
      return next(new Error("Server configuration error: JWT variables missing."));
    }

    const origin = socket.handshake.headers.origin as string | undefined;
    if (!origin || !ALLOWED.includes(origin)) {
      return next(new Error("Bad origin"));
    }

    const token = getToken(socket);
    if (!token) return next(new Error("Missing token"));

    // Verify JWT (example using an HMAC secret)
    const secret = new TextEncoder().encode(secretString);
    const { payload } = await jwtVerify(token, secret, {
      issuer,
      audience
    });

    // Attach identity to socket
    (socket as any).user = { sub: payload.sub, role: payload.role };

    return next();
  } catch (err) {
    return next(new Error("Unauthorized"));
  }
}
