import { Application, FederatedPointerEvent, Point, Ticker } from 'pixi.js';
import { Animal } from './components/Animal';
import { BottomPanel } from './components/BottomPanel';
import { GameField } from './components/GameField';
import { ResultScreen } from './components/ResultScreen';
import { TopPanel } from './components/TopPanel';
import { BUTTON_CLICK_EVENT } from './consts/CEvents';
import { ANIMAL_GRAVITY, ANIMAL_RADIUS, ANIMAL_REMOVE_INTERVAL as ANIMAL_REMOVE_TIME, ANIMAL_SPAWN_INTERVAL, ANIMAL_TYPES_COUNT, GAME_FIELD_PADDING, GAME_HEIGHT, GAME_WIDTH, MAX_ANIMALS_COUNT_ON_GAME_FIELD } from './consts/CGame';
import { BUTTON_TYPE_GRAVITY, BUTTON_TYPE_NUMBER, TYPE_DECREASE, TYPE_INCREASE } from './consts/CTypes';

enum GameState {
    GAME,
    WIN,
    LOSE
}

export class Game {
    private app: Application;
    private gameField!: GameField;
    private animals: Animal[];
    private topPanel!: TopPanel;
    private bottomPanel!: BottomPanel;
    private resultScreen!: ResultScreen;

    private gameState: number = 0;
    private gravity: number = 0;
    private targetType: number = 0;
    private numberOfShapesPerSecond: number = 0;
    private spawnIntervalId: number;
    private removeAnimalTimeoutId: number;

    constructor(app:Application) {
        this.app = app;
        this.targetType = -1;
        this.spawnIntervalId = -1;
        this.removeAnimalTimeoutId = -1;
        this.numberOfShapesPerSecond = 1;
        this.gravity = ANIMAL_GRAVITY;
        this.animals = [];

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
        this.updateAnimalsGravity();
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
            this.startSpawnAnimals();
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
        this.removeAnimals();
        this.startSpawnAnimals();
    }

    private initGameTimer(): void {
        this.app.ticker.add((delta: Ticker) => this.onGameTimerTicked(delta));
    }

    private startSpawnAnimals(): void {
        this.spawnIntervalId = setInterval(() => {
            this.spawnAnimal();
        }, ANIMAL_SPAWN_INTERVAL / this.numberOfShapesPerSecond);
    }

    private spawnAnimal(position?:Point): void {
        if(this.animals.length >= MAX_ANIMALS_COUNT_ON_GAME_FIELD) {
            return;
        }
        
        let animalPosition = position || this.getRandomPosition();
        const animal = new Animal(animalPosition, this.getEnemyType(), this.gravity);
        this.animals.push(animal);
        this.gameField.addChild(animal);
        this.updateShapeCounter();
    }


    private updateAnimalsGravity(): void {
        this.animals.forEach((animal, index) => {
           animal.updateGravity(this.gravity);
        });
    }

    private updateShapeCounter(): void {
        this.topPanel.updateShapeCounter(this.animals.length);
    }

    private updateGameAreaText(): void {
        this.topPanel.updateGameAreaText(this.getAreaInSquarePixels());
    }

    private onGameTimerTicked(delta: Ticker): void {
        if(this.gameState !== GameState.GAME) {
            return;
        }

        let deltaTime:number = parseFloat(delta.deltaTime.toFixed(4));
        this.animals.forEach((animal, index) => {
            animal.updatePatrolTarget(deltaTime);
        });
    }


    private onGameFieldClicked(event: FederatedPointerEvent): void {
        const mouseClickPosition = new Point(event.global.x, event.global.y);
        if(this.gameState === GameState.WIN || this.gameState === GameState.LOSE){
            this.app.ticker.start();
            this.startGame();
        } else if (this.gameState === GameState.GAME){
            this.tryToFindHittedAnimal(mouseClickPosition);
        }
    }

    private tryToFindHittedAnimal(mouseClickPosition:Point): void {
        if(this.targetType != -1) {
            return;
        }

        let target!:Animal;
        this.animals.forEach((animal, index) => {
            if(this.checkHitTestMouseWithAnimal(mouseClickPosition, animal) && !target) {
                target = animal;
            }
        });

        if(target) {
            this.onFindHiddenAnimal(target);
        } else {
            this.onNotFindHiddenAnimal(mouseClickPosition);
        }
    }

    private onFindHiddenAnimal(target:Animal): void {
        let targetColor = target.getColor();
        this.targetType = target.getType();
        this.animals.forEach((animal, index) => {
            if(animal.getType() === this.targetType) {
                animal.setColor(targetColor);
            }
        });

        let callback = this.removeTargetAnimals.bind(this);
        this.clearRemoveAnimalTimeoutId();
        this.removeAnimalTimeoutId = setTimeout(function() {
            callback && callback();
        }, ANIMAL_REMOVE_TIME); 
    }

    private onNotFindHiddenAnimal(mouseClickPosition:Point): void {
        this.spawnAnimal(mouseClickPosition);
    }

    private checkHitTestMouseWithAnimal(mousePosition:Point, animal: Animal): boolean {
        const bounds = animal.getBounds();
        return bounds.containsPoint(mousePosition.x, mousePosition.y);
    }

    private getRandomPosition(): Point {
        return new Point(ANIMAL_RADIUS + Math.random() * (GAME_WIDTH - ANIMAL_RADIUS), - ANIMAL_RADIUS);
    }

    private getEnemyType(): number {
        return Math.round(Math.random() * ANIMAL_TYPES_COUNT);
    }

    private getAreaInSquarePixels(): number {
        return GAME_WIDTH * GAME_HEIGHT;
    }

    public destroy() {
        this.app.ticker.remove(this.onGameTimerTicked);
        this.clearRemoveAnimalTimeoutId();
        this.clearSpawnIntervalId();
        this.removeAnimals();

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
        if(this.spawnIntervalId != -1) {
            clearInterval(this.spawnIntervalId);
            this.spawnIntervalId = -1;
        }
    }

    private clearRemoveAnimalTimeoutId(): void {
        if(this.removeAnimalTimeoutId != -1) {
            clearInterval(this.removeAnimalTimeoutId);
            this.removeAnimalTimeoutId = -1;
        }
    }

    private removeTargetAnimals(): void {
        for (var i = this.animals.length-1; i >= 0; i--) {
            if(this.animals[i].getType() === this.targetType) {
                this.removeAnimal(this.animals[i], i);
            }
        }
        this.targetType = -1;
    }

    private removeAnimals(): void {
        if(!this.animals.length) {
            return;
        }
        for (var i = this.animals.length-1; i >= 0; i--) {
            this.removeAnimal(this.animals[i], i);
        }
        this.animals = [];
    }

    private removeAnimal(animal: Animal, index:number): void {
        this.gameField.removeChild(animal);
        this.animals.splice(index, 1);
        animal.destroy();
    }
}