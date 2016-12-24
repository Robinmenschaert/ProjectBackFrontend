import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGameCanvas]'
})
export class GameCanvasDirective {
  keepgoing:boolean = true;
  position:number = 20;
  canvasWidth:number;
  canvasHeight:number;
  canvasContext: CanvasRenderingContext2D;

  constructor(canvasRef: ElementRef) {
    let canvas = <HTMLCanvasElement> canvasRef.nativeElement;

    this.canvasContext = canvas.getContext("2d");
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.animate();
  }

  animate = () => {
    if(this.keepgoing){
      requestAnimationFrame(this.animate);
      this.draw();
    }
  }

  draw = () => {
    this.canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight)
    this.position += 10;
    this.canvasContext.fillRect(this.position,this.position,50,50);
  }
  draw = () => {
  }
}
