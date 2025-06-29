import { Application, FederatedPointerEvent, Point, Ticker } from 'pixi.js';
import { BottomPanel } from './components/BottomPanel';
import { GameField } from './components/GameField';
import { GameShape } from './components/GameShape';
import { ResultScreen } from './components/ResultScreen';
import { TopPanel } from './components/TopPanel';
import { BUTTON_CLICK_EVENT } from './consts/CEvents';
import { GAME_FIELD_PADDING, GAME_HEIGHT, GAME_WIDTH, MAX_SHAPES_ON_GAME_FIELD, SHAPE_GRAVITY, SHAPE_REMOVE_INTERVAL as SHAPE_REMOVE_TIME, SHAPE_SPAWN_INTERVAL, SHAPE_TYPES_COUNT, SHAPE_WIDTH } from './consts/CGame';
import { BUTTON_TYPE_GRAVITY, BUTTON_TYPE_NUMBER, TYPE_DECREASE, TYPE_INCREASE } from './consts/CTypes';

enum GameState {
    GAME,
    WIN,
    LOSE
}

export class Game {
    private app: Application;
    private gameField!: GameField;
    private shapes: GameShape[];
    private topPanel!: TopPanel;
    private bottomPanel!: BottomPanel;
    private resultScreen!: ResultScreen;

    private gameState: number = 0;
    private gravity: number = 0;
    private targetType: number = 0;
    private numberOfShapesPerSecond: number = 0;
    private shapesCreateIntervalId: number;
    private shapesRemoveTimeoutId: number;

    constructor(app:Application) {
        this.app = app;
        this.targetType = -1;
        this.shapesCreateIntervalId = -1;
        this.shapesRemoveTimeoutId = -1;
        this.numberOfShapesPerSecond = 1;
        this.gravity = SHAPE_GRAVITY;
        this.shapes = [];

        this.init();
    }

    private init(): void {
        this.initGameComponents();
        this.updateScores();
        this.startGame();
        this.initGameTimer();
    }

    private initGameComponents(): void {
        this.gameField = new GameField();
        this.gameField.x = GAME_FIELD_PADDING;
        this.gameField.y = GAME_FIELD_PADDING;
        this.gameField.on('mousedown', this.onGameFieldClicked.bind(this));
        this.app.stage.addChild(this.gameField);

        this.topPanel = new TopPanel();
        this.app.stage.addChild(this.topPanel);
        this.updateGameAreaText();

        this.bottomPanel = new BottomPanel();
        this.bottomPanel.y = GAME_HEIGHT + 31;
        this.bottomPanel.numberButton.on(BUTTON_CLICK_EVENT, this.onButtonClicked.bind(this));
        this.bottomPanel.gravityButton.on(BUTTON_CLICK_EVENT, this.onButtonClicked.bind(this));
        this.app.stage.addChild(this.bottomPanel);

        this.resultScreen = new ResultScreen();
        this.app.stage.addChild(this.resultScreen);
    }

    private updateScores(): void {
        this.bottomPanel.updateShapeNumber(this.numberOfShapesPerSecond);
        this.bottomPanel.updateGravity(this.gravity);
        this.updateShapesGravity();
    }

    private onButtonClicked(data: { name: string; type: string }): void {
        if(data.name === BUTTON_TYPE_NUMBER) {
            this.clearSpawnIntervalId();
            if (data.type === TYPE_INCREASE) {
                this.numberOfShapesPerSecond++;
            }
            if (data.type === TYPE_DECREASE) {
                this.numberOfShapesPerSecond--;

                if(this.numberOfShapesPerSecond < 1) {
                    this.numberOfShapesPerSecond = 1;
                }
            }
            this.startCreatingShapes();
        }

        if(data.name === BUTTON_TYPE_GRAVITY) {
            if (data.type === TYPE_INCREASE) {
                this.gravity++;
            }
            if (data.type === TYPE_DECREASE) {
                this.gravity--;

                if(this.gravity < 1) {
                    this.gravity = 1;
                }
            }
        }

        this.updateScores();
    }

    private startGame(): void {
        this.gameState = GameState.GAME;

        this.resultScreen.reset();
        this.removeShapes();
        this.startCreatingShapes();
    }

    private initGameTimer(): void {
        this.app.ticker.add((delta: Ticker) => this.onGameTimerTicked(delta));
    }

    private startCreatingShapes(): void {
        this.shapesCreateIntervalId = setInterval(() => {
            this.createShape();
        }, SHAPE_SPAWN_INTERVAL / this.numberOfShapesPerSecond);
    }

    private createShape(position?:Point): void {
        if(this.shapes.length >= MAX_SHAPES_ON_GAME_FIELD) {
            return;
        }
        
        let shapePosition = position || this.getRandomPosition();
        const shape = new GameShape(shapePosition, this.getEnemyType(), this.gravity);
        this.shapes.push(shape);
        this.gameField.addChild(shape);
        this.updateShapeCounter();
    }


    private updateShapesGravity(): void {
        this.shapes.forEach((shape, index) => {
           shape.updateGravity(this.gravity);
        });
    }

    private updateShapeCounter(): void {
        this.topPanel.updateShapeCounter(this.shapes.length);
    }

    private updateGameAreaText(): void {
        this.topPanel.updateGameAreaText(this.getAreaInSquarePixels());
    }

    private onGameTimerTicked(delta: Ticker): void {
        if(this.gameState !== GameState.GAME) {
            return;
        }

        let deltaTime:number = parseFloat(delta.deltaTime.toFixed(4));
        this.shapes.forEach((shape, index) => {
            shape.updatePatrolTarget(deltaTime);
        });
    }


    private onGameFieldClicked(event: FederatedPointerEvent): void {
        const mouseClickPosition = new Point(event.global.x, event.global.y);
        if(this.gameState === GameState.WIN || this.gameState === GameState.LOSE){
            this.app.ticker.start();
            this.startGame();
        } else if (this.gameState === GameState.GAME){
            this.tryToFindHittedShape(mouseClickPosition);
        }
    }

    private tryToFindHittedShape(mouseClickPosition:Point): void {
        if(this.targetType != -1) {
            return;
        }

        let target!:GameShape;
        this.shapes.forEach((shape, index) => {
            if(this.checkHitTestMouseWithShape(mouseClickPosition, shape) && !target) {
                target = shape;
            }
        });

        if(target) {
            this.onFindHitShape(target);
        } else {
            this.onNotFindHitShape(mouseClickPosition);
        }
    }

    private onFindHitShape(target:GameShape): void {
        let targetColor = target.getColor();
        this.targetType = target.getType();
        this.shapes.forEach((shape, index) => {
            if(shape.getType() === this.targetType) {
                shape.setColor(targetColor);
            }
        });

        let callback = this.removeTargetShapes.bind(this);
        this.clearShapesRemoveTimeoutId();
        this.shapesRemoveTimeoutId = setTimeout(function() {
            callback && callback();
        }, SHAPE_REMOVE_TIME); 
    }

    private onNotFindHitShape(mouseClickPosition:Point): void {
        this.createShape(mouseClickPosition);
    }

    private checkHitTestMouseWithShape(mousePosition:Point, shape: GameShape): boolean {
        const bounds = shape.getBounds();
        return bounds.containsPoint(mousePosition.x, mousePosition.y);
    }

    private getRandomPosition(): Point {
        return new Point(SHAPE_WIDTH + Math.random() * (GAME_WIDTH - SHAPE_WIDTH), - SHAPE_WIDTH);
    }

    private getEnemyType(): number {
        return Math.round(Math.random() * SHAPE_TYPES_COUNT);
    }

    private getAreaInSquarePixels(): number {
        return GAME_WIDTH * GAME_HEIGHT;
    }

    public destroy() {
        this.app.ticker.remove(this.onGameTimerTicked);
        this.clearShapesRemoveTimeoutId();
        this.clearSpawnIntervalId();
        this.removeShapes();

        this.app.stage.removeChild(this.gameField);
        this.app.stage.removeChild(this.topPanel);
        this.app.stage.removeChild(this.bottomPanel);
        this.app.stage.removeChild(this.resultScreen);
        this.topPanel.destroy();
        this.bottomPanel.destroy();
        this.resultScreen.destroy();
        
        this.gameField.off('mousedown', this.onGameFieldClicked.bind(this));
        this.gameField.removeAllListeners();
        this.gameField.destroy();
        this.app.destroy();
    }

    private clearSpawnIntervalId(): void {
        if(this.shapesCreateIntervalId != -1) {
            clearInterval(this.shapesCreateIntervalId);
            this.shapesCreateIntervalId = -1;
        }
    }

    private clearShapesRemoveTimeoutId(): void {
        if(this.shapesRemoveTimeoutId != -1) {
            clearInterval(this.shapesRemoveTimeoutId);
            this.shapesRemoveTimeoutId = -1;
        }
    }

    private removeTargetShapes(): void {
        for (var i = this.shapes.length-1; i >= 0; i--) {
            if(this.shapes[i].getType() === this.targetType) {
                this.removeShape(this.shapes[i], i);
            }
        }
        this.targetType = -1;
    }

    private removeShapes(): void {
        if(!this.shapes.length) {
            return;
        }
        for (var i = this.shapes.length-1; i >= 0; i--) {
            this.removeShape(this.shapes[i], i);
        }
        this.shapes = [];
    }

    private removeShape(shape: GameShape, index:number): void {
        this.gameField.removeChild(shape);
        this.shapes.splice(index, 1);
        shape.destroy();
    }
}