import { Container, Graphics } from 'pixi.js';
import { BUTTON_COLOR, TEXT_COLOR } from '../consts/CColor';
import { BUTTON_CLICK_EVENT } from '../consts/CEvents';
import { BUTTON_HEIGHT, BUTTON_ROUND_RADIUS, BUTTON_WIDTH } from '../consts/CGame';
import { BUTTON_TEXT_STYLE } from '../consts/CText';
import { TYPE_DECREASE, TYPE_INCREASE } from '../consts/CTypes';
import { BaseElement } from './BaseElement';

export class GameButton extends BaseElement {
    private increaseButton!:Container;
    private decreaseButton!:Container;
    private buttonName: string;

    constructor(buttonName:string) {
        super();
        this.buttonName = buttonName;
        this.init();
    }

    private init():void {
        this.initDecreaseButton();
        this.initIncreaseButton();
    }

    private initIncreaseButton() {
        let increaseBackground = new Graphics();
        increaseBackground.roundRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_ROUND_RADIUS);
        increaseBackground.fill(BUTTON_COLOR);
        increaseBackground.stroke({ width: BUTTON_TEXT_STYLE.strokeThickness, color: BUTTON_TEXT_STYLE.stroke })
        this.drawButtonTextImage(increaseBackground, "+");

        this.increaseButton = new Container();
        this.increaseButton.x = BUTTON_WIDTH;
        this.increaseButton.addChild(increaseBackground);
        this.increaseButton.interactive = true;
        this.increaseButton.on('pointerdown', this.onIncreaseButtonClicked.bind(this));
        this.addChild(this.increaseButton);
    }

    private initDecreaseButton() {
        let decreaseButtonBackground = new Graphics();
        decreaseButtonBackground.roundRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_ROUND_RADIUS);
        decreaseButtonBackground.fill(BUTTON_COLOR);
        decreaseButtonBackground.stroke({ width: BUTTON_TEXT_STYLE.strokeThickness, color: BUTTON_TEXT_STYLE.stroke })
        this.drawButtonTextImage(decreaseButtonBackground, "-");
        
        this.decreaseButton = new Container();
        this.decreaseButton.addChild(decreaseButtonBackground);
        this.decreaseButton.interactive = true;
        this.decreaseButton.on('pointerdown', this.onDecreaseButtonClicked.bind(this));
        this.addChild(this.decreaseButton);
    }

    private drawButtonTextImage(graphics:Graphics, symbol:string) {
        const centerX = graphics.width / 2;
        const centerY = graphics.height / 2;
        const lineLength = Math.min(graphics.width, graphics.height) / 2.5;
        graphics.moveTo(centerX - lineLength / 2, centerY);
        graphics.lineTo(centerX + lineLength / 2, centerY);
        if (symbol === '+') {
            graphics.moveTo(centerX, centerY - lineLength / 2);
            graphics.lineTo(centerX, centerY + lineLength / 2);
        }
        graphics.stroke({ width: 2, color: TEXT_COLOR });
    }

    private onIncreaseButtonClicked() {
        this.emit(BUTTON_CLICK_EVENT, {name: this.buttonName, type: TYPE_INCREASE});
    }

    private onDecreaseButtonClicked() {
        this.emit(BUTTON_CLICK_EVENT, {name: this.buttonName, type: TYPE_DECREASE});
    }

    public destroy() {
        super.destroy();

        this.removeChild(this.increaseButton);
        this.increaseButton.off('pointerdown', this.onIncreaseButtonClicked.bind(this));
        this.increaseButton.destroy();

        this.removeChild(this.decreaseButton);
        this.decreaseButton.off('pointerdown', this.onDecreaseButtonClicked.bind(this));
        this.decreaseButton.destroy();
    }
}