import { WebSocketServer } from "ws";
import WebSocket from "ws";
import "dotenv/config";

const PORT = 8080;
const GEMINI_API_KEY = process.env.GEMINI_LIVE_API_KEY || "";

console.info(`GEMINI_API_KEY available: ${!!process.env.GEMINI_LIVE_API_KEY}`);

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY missing. Please add it in .env file.");
  process.exit(1);
}
const MODEL = "models/gemini-2.0-flash-exp";
const GEMINI_WEBSOCKET_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

const wss = new WebSocketServer({ port: PORT });
console.info(`🚀 WebSocket proxy server started on ws://localhost:${PORT}`);

// --- Event handler for new client connections ---
wss.on("connection", (clientWs, req) => {
  console.info("✅ Frasa client connected.");

  // When a client connects to our server, we establish a new connection to the Gemini API.
  // We pass the API key as a custom header for authentication.
  const geminiWs = new WebSocket(GEMINI_WEBSOCKET_URL, {
    headers: {
      "x-goog-api-key": GEMINI_API_KEY,
    },
  });

  // --- Event Handlers for the connection TO GEMINI ---
  geminiWs.on("open", () => {
    console.info("🔗 Successfully connected to Gemini Live API.");
    const setupMessage = {
      setup: {
        model: MODEL,
        generation_config: {
          response_modalities: ["AUDIO"],
        },
      },
    };

    console.info("::Send initial setup");
    geminiWs?.send(JSON.stringify(setupMessage));
  });

  geminiWs.on("message", (data) => {
    // Message received from Gemini. Relay it directly to the connected Next.js client.
    console.info("⬅️ Received from Gemini:");
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data.toString());
    }
  });

  geminiWs.on("close", (e) => {
    console.info("Disconnected from Gemini Live API.");
    // Close the connection with the client when the Gemini connection closes.
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close();
    }
  });

  geminiWs.on("error", (error) => {
    console.error("💥 Error with Gemini WebSocket:", error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(1011, "An internal server error occurred.");
    }
  });

  // --- Event Handlers for the connection FROM THE CLIENT ---
  clientWs.on("message", (message) => {
    console.info(
      `Gemini WebSocket readyState = ${geminiWs.readyState} (OPEN=${WebSocket.OPEN})`,
    );
    if (geminiWs.readyState === WebSocket.OPEN) {
      if (typeof message === "string") {
        geminiWs.send(message);
      } else {
        geminiWs.send(message);
      }
    } else {
      console.warn("Tried to send message, but Gemini WebSocket is not open.");
    }
  });

  clientWs.on("close", () => {
    console.info("👋 Next.js client disconnected.");
    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.close();
    }
  });

  clientWs.on("error", (error) => {
    console.error("💥 Error with client WebSocket:", error);
    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.close();
    }
  });
});
