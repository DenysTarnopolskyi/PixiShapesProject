import { Text } from 'pixi.js';
import { BUTTON_TEXT_STYLE } from '../consts/CText';
import { BaseElement } from './BaseElement';

export class TextFieldWithBorder extends BaseElement {
    private textField!:Text;
    private text:string;

  constructor(text:string) {
        super();
        this.text = text || "";
        this.init();
    }

    protected draw() {
        this.background.rect(0, 0, BUTTON_TEXT_STYLE.wordWrapWidth, BUTTON_TEXT_STYLE.wordWrapHeight);
        this.background.fill(BUTTON_TEXT_STYLE.fill);
        this.background.stroke({width: BUTTON_TEXT_STYLE.strokeThickness, color: BUTTON_TEXT_STYLE.stroke});
        this.addChild(this.background);
    }

    private redrawBackground(): void {
        this.background.clear();
        this.background.rect(0, 0, this.textField.width + BUTTON_TEXT_STYLE.padding * 2, this.textField.height + BUTTON_TEXT_STYLE.padding * 2);
        this.background.fill(BUTTON_TEXT_STYLE.fill);
        this.background.stroke({width: BUTTON_TEXT_STYLE.strokeThickness, color: BUTTON_TEXT_STYLE.stroke});
    }

    private init(): void {
        this.initScoreTextField();
    }

    private initScoreTextField(): void {
        this.textField = new Text({ text: this.text, style: this.getFont() });
        this.textField.x = BUTTON_TEXT_STYLE.padding;
        this.textField.y = BUTTON_TEXT_STYLE.padding;
        this.addChild(this.textField);
    }

    public updateText(value: String | number): void {
        this.textField.text = this.text + value;
        this.redrawBackground();
    }

    public destroy() {
        super.destroy();

        this.removeChild(this.textField);
        this.textField.destroy();
    }
}