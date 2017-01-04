import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGameCanvas]'
})
export class GameCanvasDirective {
  canvasSize: Size;
  canvasContext: CanvasRenderingContext2D;

  selfTankSize: Size;
  selfTankImage:any;
  selfProjectiles: Array<Projectile>;

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
    this.selfProjectiles = new Array<Projectile>();

    this.canvasContext = canvas.getContext("2d");
    this.canvasSize = new Size();
    this.canvasSize.width = canvas.width;
    this.canvasSize.height = canvas.height;

    this.self = new Self();
    this.self.position = new Position(this.canvasSize.width/2, this.canvasSize.height/2);
    this.self.mousePosition = new Position();
    this.self.viewAngle = 0.0;

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    canvas.addEventListener("mousemove", this.onMouseMove);

    this.animate();
  }

  onKeyDown = (event: KeyboardEvent) => {
    switch(event.keyCode) {
      case 32:
        this.isMoving = true;
        break;
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    switch(event.keyCode) {
      case 32:
        this.isMoving = false;
        break;
      case 81:
        console.log("q");
        this.selfProjectiles.push(new Projectile(this.self.position.x, this.self.position.y, this.self.viewAngle));
        break;
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
    this.calculateSelfProjectilesPosition();
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

  calculateSelfProjectilesPosition = () => {
    const speed = 7;

    for(let projectile of this.selfProjectiles) {
      projectile.position.x += Math.sin(projectile.angle) * speed;
      projectile.position.y -= Math.cos(projectile.angle) * speed;
    }
  }

  draw = () => {
    this.canvasContext.clearRect(0,0, this.canvasSize.width, this.canvasSize.height);
    this.drawSelf();
    this.drawEnemies();
    this.drawTanks();
    this.drawSelfProjectiles();
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
  drawSelfProjectiles = () => {
    for(let projectile of this.selfProjectiles) {
      this.canvasContext.beginPath();
      this.canvasContext.arc(projectile.position.x, projectile.position.y, 5, 0, 2 * Math.PI, false);
      this.canvasContext.fillStyle = 'green';
      this.canvasContext.fill();
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = '#003300';
      this.canvasContext.stroke();
    }
  }
}

export class Position {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x;
    this.y = y;
  }
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

export class Projectile {
  position: Position;
  angle: number;

  constructor(initialX?: number, initialY?: number, angle?: number) {
    this.position = new Position(initialX, initialY);
    this.angle = angle;
  }
}