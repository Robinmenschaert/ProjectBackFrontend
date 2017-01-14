import { Directive, ElementRef } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Position,  Size, Self, Projectile, Target} from '../domain/entity';

@Directive({
  selector: '[appGameCanvas]',
  providers: [SocketService]
})
export class GameCanvasDirective {
  // Constants
  projectileRadius: number = 5;
  selfTankSize: Size = new Size(45, 50);

  //
  canvasSize: Size;
  canvasContext: CanvasRenderingContext2D;


  selfTankImage:any;
  selfProjectiles: Array<Projectile>;
  enemyProjectiles: Array<Projectile>;

  targets: Target[];

  self: Self;
  isMoving: boolean;

  constructor(private canvasRef: ElementRef, private socketService: SocketService) {
    let canvas = <HTMLCanvasElement> canvasRef.nativeElement;
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    this.selfTankImage = new Image();
    this.selfTankImage.src = "/assets/selfTank2.png";
    this.selfProjectiles = new Array<Projectile>();
    this.enemyProjectiles = new Array<Projectile>();

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

    this.init();
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
        let newProjectile = new Projectile(this.self.position.x, this.self.position.y, this.self.viewAngle);
        this.selfProjectiles.push(newProjectile);
        this.socketService.shoot(newProjectile);
        break;
    }
  }

  onMouseMove = (event: MouseEvent) => {
    this.self.mousePosition.x = event.clientX;
    this.self.mousePosition.y = event.clientY;
  }

  init = () => {
    /* function aanroeppen */
    this.socketService.get();
    /* TEMP CALCULATE TARGETS, WILL MOVE TO SERVER EVENTUALLY */
    /* op de server zetten */
    const targetCount = 5;
    this.targets = new Array<Target>(targetCount);
    for(let x = 0; x < targetCount; x ++) {
      this.targets[x] = new Target();
      this.targets[x].position = new Position(Math.random() * this.canvasSize.width, Math.random() * this.canvasSize.height);
      this.targets[x].character = "A";
    }

    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
    this.draw();
  }

  update = () => {
    this.calculateSelfPosition();
    this.calculateSelfProjectilesPosition();

    this.performSelfHitDetection();
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
      if(!projectile.hasHit) {
        projectile.position.x += Math.sin(projectile.angle) * speed;
        projectile.position.y -= Math.cos(projectile.angle) * speed;
      }
    }
  }

  performSelfHitDetection = () => {
    for(let projectileIndex = this.selfProjectiles.length - 1; projectileIndex >= 0; projectileIndex --) {
      for(let targetIndex = this.targets.length - 1; targetIndex >= 0; targetIndex --) {
        let projectile = this.selfProjectiles[projectileIndex];
        let target = this.targets[targetIndex];

        let pP = projectile.position;
        let tP = target.position;

        if (pP.x < tP.x + this.selfTankSize.width
            && pP.x + this.projectileRadius > tP.x
            && pP.y < tP.y + this.selfTankSize.height
            && this.projectileRadius + pP.y > tP.y) {

            this.selfProjectiles.splice(projectileIndex, 1);
            this.targets.splice(targetIndex, 1);
            break;
        }
      }
    }
  }

  draw = () => {
    this.canvasContext.clearRect(0,0, this.canvasSize.width, this.canvasSize.height);
    this.drawSelf();
    this.drawTargets();
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
  drawTargets = () => {
    this.canvasContext.save();
    this.canvasContext.font = "25px serif";

    for(let target of this.targets) {
      this.canvasContext.fillText(target.character, target.position.x, target.position.y + 35);

      // debug
      this.canvasContext.strokeRect(target.position.x - 7, target.position.y + 7, 35, 35);
    }
    this.canvasContext.restore();
  }
  drawTanks = () => {
    this.canvasContext.save();

    this.canvasContext.restore();
  }
  drawSelfProjectiles = () => {
    for(let projectile of this.selfProjectiles) {
      this.canvasContext.save();
      this.canvasContext.beginPath();
      this.canvasContext.arc(projectile.position.x, projectile.position.y, this.projectileRadius, 0, 2 * Math.PI, false);

      if(projectile.hasHit) {
        this.canvasContext.fillStyle = 'red';
      }
      else {
        this.canvasContext.fillStyle = 'green';
      }

      this.canvasContext.fill();
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = '#003300';
      this.canvasContext.stroke();
      this.canvasContext.restore();
    }
  }
  drawEnemyProjectiles = () => {
    for(let projectile of this.enemyProjectiles) {
      this.canvasContext.save();
      this.canvasContext.beginPath();
      this.canvasContext.arc(projectile.position.x, projectile.position.y, this.projectileRadius, 0, 2 * Math.PI, false);

      if(projectile.hasHit) {
        this.canvasContext.fillStyle = 'red';
      }
      else {
        this.canvasContext.fillStyle = 'green';
      }

      this.canvasContext.fill();
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = '#330000';
      this.canvasContext.stroke();
      this.canvasContext.restore();
    }
  }
}
