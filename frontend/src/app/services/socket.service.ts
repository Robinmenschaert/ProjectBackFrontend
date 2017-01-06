import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import * as io from "socket.io-client";

@Injectable()
export class SocketService {
  private host: string = "http://localhost:3000";

  socket: SocketIOClient.Socket;

  constructor() { }

  public get(){
    let socketUrl = this.host;
    this.socket = io.connect(socketUrl);
    //komt toe op client van de server dus de x y en angel megeven
    this.socket.on("shoot", () => {console.log("shoot")});
    this.socket.on("drawEnemy", () => {console.log("drawEnemy")});
  }


  //stuuren naar de server
  public shoot(){
    /*let socketUrl = this.host;
    this.socket = io.connect(socketUrl);*/
    this.socket.emit("shoot");
  }

  public drawEnemy(){
    /*let socketUrl = this.host;
    this.socket = io.connect(socketUrl);*/
    this.socket.emit("drawEnemy");
  }
}
