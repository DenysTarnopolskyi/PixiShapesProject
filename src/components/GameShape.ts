import { Point } from 'pixi.js';
import { SHAPE_COLOR } from '../consts/CColor';
import { GAME_HEIGHT, GAME_WIDTH, SHAPE_WIDTH } from '../consts/CGame';
import { BaseElement } from './BaseElement';

enum GameShapeType {
    TRIANGLE,
    SQUARE,
    PENTAGON,
    HEXAGON,
    CIRCLE,
    ELLIPSE,
    STAR
};

export class GameShape extends BaseElement {
    private gravity: number;
    private type: number;
    private patrolTarget: Point;
    private color: number;

  constructor(position:Point, type:number, gravity:number) {
        super();
        this.type = type;
        this.x = position.x;
        this.y = position.y;
        this.gravity = gravity;
        this.color = 0;
        this.patrolTarget = new Point(0, 0);

        this.init();
    }

    private init(): void {
        this.drawBackground();
        this.addBackground();
        this.setPatrolTarget();
    }

    private drawBackground() {
        switch(this.type) {
            case GameShapeType.TRIANGLE:
                this.background.rect(0, 0, SHAPE_WIDTH * 2, SHAPE_WIDTH * 1.5);
            break;
            case GameShapeType.SQUARE:
                this.background.rect(0, 0, SHAPE_WIDTH * 1.75, SHAPE_WIDTH * 1.75);
            break;
            case GameShapeType.PENTAGON:
                this.drawPolygon(5, SHAPE_WIDTH, 0, 0, 0);
            break;
            case GameShapeType.HEXAGON:
                this.drawPolygon(6, SHAPE_WIDTH, 0, 0, 0);
            break;
            case GameShapeType.CIRCLE:
                this.background.circle(0, 0, SHAPE_WIDTH);
            break;
            case GameShapeType.ELLIPSE:
                this.background.ellipse(0, 0, SHAPE_WIDTH, SHAPE_WIDTH * 0.75);
            break;
            case GameShapeType.STAR:
                this.background.star(0, 0, 5, SHAPE_WIDTH);
            break;
            default:
                this.background.star(0, 0, 5, SHAPE_WIDTH);
            break;
        }
    }

    private addBackground() {
        this.color = this.getRandomColor();
        this.background.fill(this.color);
        this.addChild(this.background);
    }

    private drawPolygon(sides: number, radius: number, centerX: number, centerY: number, rotation: number = 0) {
        if (sides < 3) {
            return;
        }

        const angleStep = (Math.PI * 2) / sides;
        this.background.moveTo(centerX + Math.cos(rotation) * radius, centerY + Math.sin(rotation) * radius);
        for (let i = 1; i <= sides; i++) {
            const angle = rotation + i * angleStep;
            this.background.lineTo( centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        }
    }

    private setPatrolTarget(): void {
        this.patrolTarget = new Point(Math.random() * GAME_WIDTH, GAME_HEIGHT + SHAPE_WIDTH * 2);
    }

    private startPatrol(delta: number): void {
        if (!this.patrolTarget) {
            this.setPatrolTarget();
        }

        const dx = this.patrolTarget.x - this.x;
        const dy = this.patrolTarget.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > SHAPE_WIDTH) {
            this.x += (dx / distance) * this.gravity * delta;
            this.y += (dy / distance) * this.gravity * delta;
        } else {
            this.y = - SHAPE_WIDTH;
            this.setPatrolTarget();
        }
    }

    public updatePatrolTarget(delta: number): void {
        this.startPatrol(delta);
    }

    public updateGravity(value: number): void {
        this.gravity = value;
    }
    
    public isShapeOutSideGameField(): boolean {
        return this.y > (GAME_HEIGHT + SHAPE_WIDTH);
    }

    public getType(): number {
        return this.type;
    }

    public setColor(newColor:number): void {
        this.color = newColor;
        this.background.clear();
        this.drawBackground();
        this.background.fill(newColor);
    }

    public getColor(): number {
        return this.color;
    }
    
    private getRandomColor(): number {
        return Math.random() * SHAPE_COLOR;
    }

    public destroy() {
        super.destroy();
    }
}