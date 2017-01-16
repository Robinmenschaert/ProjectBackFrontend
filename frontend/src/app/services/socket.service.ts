import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Position,  Size, Self, Projectile, Target, Enemy} from '../domain/entity';
import * as io from "socket.io-client";

@Injectable()
export class SocketService {
  private host: string = "http://localhost:3000";

  socket: SocketIOClient.Socket;

  constructor() { }

  public connect(){
    let socketUrl = this.host;
    this.socket = io.connect(socketUrl, { query: 'token='+ localStorage.getItem('token')});
  }

  public on = (eventName: string, fn: Function) => {
    this.socket.on(eventName, (data: string, ...args: any[]) => {
        fn(JSON.parse(data), ...args);
    });
  }
  private emit = (eventName: string, obj: any) => {
    var request = new JWTRequest(localStorage.getItem('token'),obj)
    this.socket.emit(eventName, JSON.stringify(request));
  }

  shoot = (projectile: Projectile) => {
    this.emit("shoot", projectile);
  }

  positionUpdate = (selfAsEnemy: Enemy) => {
    this.emit("positionUpdate", selfAsEnemy);
  }

  targetHit = (targetId: Number) => {
    this.emit("targetHit", targetId);
  }
}

export class JWTRequest {
  JWT: string;
  data: any;

  constructor(JWT?: string, data?: any) {
    this.JWT = JWT;
    this.data = data;
  }
}
