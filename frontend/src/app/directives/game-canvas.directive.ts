import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGameCanvas]'
})
export class GameCanvasDirective {
  keepgoing:boolean = true;
  canvasWidth:number;
  canvasHeight:number;
  canvasContext: CanvasRenderingContext2D;
  selfTankImage:any;
  selfPosition:Position;

  constructor(canvasRef: ElementRef) {
    let canvas = <HTMLCanvasElement> canvasRef.nativeElement;

    this.selfTankImage = new Image();
    this.selfTankImage.src = "/assets/selfTank.png";

    this.canvasContext = canvas.getContext("2d");
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.selfPosition = new Position();
    this.selfPosition.x = this.canvasWidth/2;
    this.selfPosition.y = this.canvasHeight/2;

    window.addEventListener("keypress", this.onKeyPress);

    this.animate();


  }

  onKeyPress = (event:KeyboardEvent) => {
    console.log("press");
    console.log(event.key);
  }

  animate = () => {
    if(this.keepgoing){
      requestAnimationFrame(this.animate);
      this.draw();
    }
  }

  draw = () => {
    this.canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight)
    this.drawSelf();
    this.drawEnemies();
    this.drawTanks();
    this.drawBullets();
  }
  drawSelf = () => {
    this.canvasContext.drawImage(this.selfTankImage,this.selfPosition.x,this.selfPosition.y,9,10);
  }
  drawEnemies = () => {
  }
  drawTanks = () => {
  }
  drawBullets = () => {
  }
}

export class Position{
  x:number;
  y:number;
}
