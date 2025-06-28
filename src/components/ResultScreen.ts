import { Text } from 'pixi.js';
import { RESULT_TEXT_X_POSITION, RESULT_TEXT_Y_POSITION } from '../consts/CGame';
import { LOSE_TEXT, WIN_TEXT } from '../consts/CText';
import { BaseElement } from './BaseElement';

export class ResultScreen extends BaseElement{
    private winTextField!: Text;
    private loseTextField!: Text;

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.initWinTextField();
        this.initLoseTextField();
        this.reset();
    }

    private initWinTextField(): void {
        this.winTextField = new Text({ text: WIN_TEXT, style: this.getFont() });
        this.winTextField.x = RESULT_TEXT_X_POSITION;
        this.winTextField.y = RESULT_TEXT_Y_POSITION;
        this.addChild(this.winTextField);
    }

    private initLoseTextField(): void {
        this.loseTextField = new Text({ text: LOSE_TEXT, style: this.getFont() });
        this.loseTextField.x = RESULT_TEXT_X_POSITION;
        this.loseTextField.y = RESULT_TEXT_Y_POSITION;
        this.addChild(this.loseTextField);
    }

    public showResult(isWin:boolean): void {
        this.winTextField.visible = isWin;
        this.loseTextField.visible = !isWin;
    }

    public reset(): void {
        this.winTextField.visible = false;
        this.loseTextField.visible = false;
    }

    public destroy() {
        super.destroy();

        this.removeChild(this.winTextField);
        this.winTextField.destroy();

        this.removeChild(this.loseTextField);
        this.loseTextField.destroy();
    }
}