import { Graphics, Text } from 'pixi.js';
import { GAME_FIELD_BG_COLOR } from '../consts/CColor';
import { GAME_HEIGHT, GAME_WIDTH } from '../consts/CGame';
import { TITLE_TEXT } from '../consts/CText';
import { BaseElement } from './BaseElement';

export class GameField extends BaseElement {
    private titleTextField!: Text;

    constructor() {
        super();
        this.interactive = true;
        this.init();
    }

    protected draw(): void {
        this.background.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.background.fill(GAME_FIELD_BG_COLOR);
        this.addChild(this.background);
    }

    private init(): void {
        this.initMask();
        this.initTitleText();
    }

    private initMask(): void {
        let mask:Graphics = new Graphics();
        mask.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        mask.fill(GAME_FIELD_BG_COLOR);
        this.addChild(mask);
        this.mask = mask;
    }

    private initTitleText(): void {
        this.titleTextField = new Text({ text: TITLE_TEXT, style: this.getFont() });
        this.titleTextField.x = (GAME_WIDTH - this.titleTextField.width) * 0.5;
        this.titleTextField.y = (GAME_HEIGHT - this.titleTextField.height) * 0.5;
        this.addChild(this.titleTextField);
    }

    public destroy() {
        super.destroy();
        this.mask = null;
        this.removeChild(this.titleTextField)
        this.titleTextField.destroy();
    }
}