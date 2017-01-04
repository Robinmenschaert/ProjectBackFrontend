import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGameCanvas]'
})
export class GameCanvasDirective {
  canvasSize: Size;
  canvasContext: CanvasRenderingContext2D;

  selfTankSize: Size;
  selfTankImage:any;

  self: Self;
  isMoving: boolean;

  constructor(canvasRef: ElementRef) {
    let canvas = <HTMLCanvasElement> canvasRef.nativeElement;
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    this.selfTankSize = new Size();
    this.selfTankSize.width = 45;
    this.selfTankSize.height = 50;
    this.selfTankImage = new Image();
    this.selfTankImage.src = "/assets/selfTank2.png";

    this.canvasContext = canvas.getContext("2d");
    this.canvasSize = new Size();
    this.canvasSize.width = canvas.width;
    this.canvasSize.height = canvas.height;

    this.self = new Self();
    this.self.position = new Position();
    this.self.position.x = this.canvasSize.width/2;
    this.self.position.y = this.canvasSize.height/2;
    this.self.mousePosition = new Position();
    this.self.viewAngle = 0.0;

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    canvas.addEventListener("mousemove", this.onMouseMove);

    this.animate();
  }

  onKeyDown = (event: KeyboardEvent) => {
    if(event.keyCode === 32) {
      this.isMoving = true;
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    if(event.keyCode === 32) {
      this.isMoving = false;
    }
  }

  onMouseMove = (event: MouseEvent) => {
    this.self.mousePosition.x = event.clientX;
    this.self.mousePosition.y = event.clientY;
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
    this.draw();
  }

  update = () => {
    this.calculateSelfPosition();
  }

  calculateSelfPosition = () => {
    // Calculate our viewAngle
    let sX = this.self.position.x - (this.selfTankSize.width/2);
    let sY = this.self.position.y - (this.selfTankSize.height/2);
    let mX = this.self.mousePosition.x;
    let mY = this.self.mousePosition.y;
    this.self.viewAngle = Math.atan2(mY - sY, mX - sX);
    // Account for default angle of our tank
    this.self.viewAngle += (Math.PI/2);

    if(this.isMoving) {
      // Calculate new position
      const speed = 5;

      this.self.position.x += Math.sin(this.self.viewAngle) * speed;
      this.self.position.y -= Math.cos(this.self.viewAngle) * speed;
    }
  }

  draw = () => {
    this.canvasContext.clearRect(0,0,this.canvasSize.width,this.canvasSize.height);
    this.drawSelf();
    this.drawEnemies();
    this.drawTanks();
    this.drawBullets();
  }

  drawSelf = () => {
    this.canvasContext.save();
    this.canvasContext.translate(this.self.position.x, this.self.position.y);
    this.canvasContext.rotate(this.self.viewAngle);
    this.canvasContext.drawImage(this.selfTankImage, -(this.selfTankSize.width/2), -(this.selfTankSize.height/2), this.selfTankSize.width, this.selfTankSize.height);
    this.canvasContext.restore(); 
  }
  drawEnemies = () => {
  }
  drawTanks = () => {
  }
  drawBullets = () => {
  }
}

export class Position {
  x: number;
  y: number;
}

export class Size {
  width: number;
  height: number;
}

export class Self {
  position: Position;
  viewAngle: number;
  mousePosition: Position;
}