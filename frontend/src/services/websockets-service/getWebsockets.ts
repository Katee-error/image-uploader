import { io, Socket } from "socket.io-client";
import { Image } from "@/types";

type ImageUpdateCallback = (image: Image) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private imageUpdateCallbacks: Map<string, ImageUpdateCallback[]> = new Map();

  connect(): void {
    if (this.socket) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "Cannot connect to WebSocket: No authentication token found"
      );
      return;
    }

    this.socket = io({
      path: "/socket.io",
      auth: {
        token,
      },
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.socket.on("image:update", (image: Image) => {
      this.notifyImageUpdate(image);
    });

    this.socket.on("auth_error", async (error) => {
      console.error("WebSocket authentication error:", error);

      try {
        const currentToken = localStorage.getItem("token");
        if (!currentToken) {
          this.disconnect();
          return;
        }

        const { refreshToken } = await import("../auth-service/getAuth");
        const refreshResponse = await refreshToken(currentToken);

        if (
          refreshResponse &&
          refreshResponse.success &&
          refreshResponse.token
        ) {
          localStorage.setItem("token", refreshResponse.token);
          this.disconnect();
          this.connect();
        } else {
          localStorage.removeItem("token");
          this.disconnect();
          window.location.href = "/auth";
        }
      } catch (refreshError) {
        console.error("Failed to refresh token for WebSocket:", refreshError);
        localStorage.removeItem("token");
        this.disconnect();
        window.location.href = "/auth";
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToImageUpdates(
    imageId: string,
    callback: ImageUpdateCallback
  ): () => void {
    if (!this.imageUpdateCallbacks.has(imageId)) {
      this.imageUpdateCallbacks.set(imageId, []);
    }

    const callbacks = this.imageUpdateCallbacks.get(imageId)!;
    callbacks.push(callback);

    if (this.socket && this.socket.connected) {
      this.socket.emit("subscribe:image", { imageId });
    }

    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }

      if (callbacks.length === 0) {
        this.imageUpdateCallbacks.delete(imageId);
        if (this.socket && this.socket.connected) {
          this.socket.emit("unsubscribe:image", { imageId });
        }
      }
    };
  }

  private notifyImageUpdate(image: Image): void {
    const callbacks = this.imageUpdateCallbacks.get(image.id);
    if (callbacks) {
      callbacks.forEach((callback) => callback(image));
    }
  }
}

export const websocketService = new WebSocketService();
