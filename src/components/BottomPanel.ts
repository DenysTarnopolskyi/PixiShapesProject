import { BUTTON_GRAVITY_TEXT, BUTTON_NUMBER_TEXT } from '../consts/CText';
import { BUTTON_TYPE_GRAVITY, BUTTON_TYPE_NUMBER } from '../consts/CTypes';
import { BaseElement } from './BaseElement';
import { GameButton } from './GameButton';
import { TextFieldWithBorder } from './TextFieldWithBorder';

export class BottomPanel extends BaseElement{
    public numberButton!: GameButton;
    public gravityButton!: GameButton;

    private numberText!: TextFieldWithBorder;
    private gravityText!: TextFieldWithBorder;

    constructor() {
        super();
        this.init()
    }

    private init(): void {
        this.initNumberText();
        this.initNumberButton();

        this.initGravityText();
        this.initGravityButton();
    }

    private initNumberText(): void {
        this.numberText = new TextFieldWithBorder(BUTTON_NUMBER_TEXT);
        this.numberText.x = 190;
        this.numberText.y = 7;
        this.addChild(this.numberText);
    }

    private initNumberButton(): void {
        this.numberButton = new GameButton(BUTTON_TYPE_NUMBER);
        this.numberButton.x = 30;
        this.numberButton.y = 0;
        this.addChild(this.numberButton);
    }

    private initGravityText(): void {
        this.gravityText = new TextFieldWithBorder(BUTTON_GRAVITY_TEXT);
        this.gravityText.x = 878;
        this.gravityText.y = 7;
        this.addChild(this.gravityText);
    }

    private initGravityButton(): void {
        this.gravityButton = new GameButton(BUTTON_TYPE_GRAVITY);
        this.gravityButton.x = 718;
        this.gravityButton.y = 0;
        this.addChild(this.gravityButton);
    }

    public updateShapeNumber(value:number = 1): void {
        this.numberText.updateText(value);
    }

    public updateGravity(value:number = 1): void {
        this.gravityText.updateText(value);
    }

    public destroy() {
        super.destroy();

        this.removeChild(this.numberText);
        this.numberText.destroy();
        
        this.removeChild(this.gravityButton);
        this.gravityButton.destroy();

        this.removeChild(this.numberButton);
        this.numberButton.destroy();

        this.removeChild(this.gravityButton);
        this.gravityButton.destroy();
    }
}