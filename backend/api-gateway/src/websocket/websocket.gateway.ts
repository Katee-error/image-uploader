import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { WebsocketService } from "./websocket.service";
import { User } from "../generated/auth.pb";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/",
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly websocketService: WebsocketService
  ) {}

  afterInit(server: Server) {
    this.websocketService.setServer(server);
    this.logger.log("WebSocket Gateway initialized");
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const { valid, user } = await this.authService.validateTokenString(token);

      if (!valid || !user) {
        client.emit("auth_error", { message: "Invalid or expired token" });
        client.disconnect();
        return;
      }
      client.data.user = user;
      client.join(`user:${user.id}`);

      this.logger.log(`Client connected: ${client.id}, User: ${user.email}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("subscribe:image")
  handleSubscribeToImage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { imageId: string }
  ) {
    if (!data.imageId) {
      return { success: false, message: "Image ID is required" };
    }

    client.join(`image:${data.imageId}`);
    this.logger.log(`Client ${client.id} subscribed to image: ${data.imageId}`);

    return { success: true, message: "Subscribed to image updates" };
  }

  @SubscribeMessage("unsubscribe:image")
  handleUnsubscribeFromImage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { imageId: string }
  ) {
    if (!data.imageId) {
      return { success: false, message: "Image ID is required" };
    }

    client.leave(`image:${data.imageId}`);
    this.logger.log(
      `Client ${client.id} unsubscribed from image: ${data.imageId}`
    );

    return { success: true, message: "Unsubscribed from image updates" };
  }
}
