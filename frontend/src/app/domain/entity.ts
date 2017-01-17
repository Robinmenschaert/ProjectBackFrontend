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

  constructor(width?: number, height?: number) {
    this.width = width;
    this.height = height;
  }
}

export class Self {
  position: Position;
  viewAngle: number;
  mousePosition: Position;
  score: number;
}

export class Enemy {
  position: Position;
  viewAngle: number;
  score: number;
}

export class Projectile {
  position: Position;
  character: string;
  angle: number;
  hasHit: boolean;

  constructor(initialX?: number, initialY?: number, angle?: number) {
    this.position = new Position(initialX, initialY);
    this.angle = angle;
  }
}

export class Target {
  position: Position;
  character: string;
  isHit: boolean;
  id: number;
}
