import { SM_TEXT as PX_TEXT, TITLE_AREA_TEXT, TITLE_SHAPE_NUMBERS_TEXT as TITLE_COUNTER_TEXT } from '../consts/CText';
import { BaseElement } from './BaseElement';
import { TextFieldWithBorder } from './TextFieldWithBorder';

export class TopPanel extends BaseElement{
    private counterText!: TextFieldWithBorder;
    private areaText!: TextFieldWithBorder;

    constructor() {
        super();
        this.init()
    }

    private init(): void {
        this.initCounterText();
        this.initGameAreaText();
        
        this.updateGameAreaText(0);
        this.updateShapeCounter(0);
    }

    private initCounterText(): void {
        this.counterText = new TextFieldWithBorder(TITLE_COUNTER_TEXT);
        this.counterText.x = 30;
        this.counterText.y = 2;
        this.addChild(this.counterText);
    }

    private initGameAreaText(): void {
        this.areaText = new TextFieldWithBorder(TITLE_AREA_TEXT);
        this.areaText.x = 592;
        this.areaText.y = 2;
        this.addChild(this.areaText);
    }

    public updateGameAreaText(value:number): void {
        this.areaText.updateText(value + PX_TEXT);
    }

    public updateShapeCounter(value:number = 1): void {
        this.counterText.updateText(value);
    }
    
    public destroy() {
        super.destroy();
       
        this.removeChild(this.counterText);
        this.counterText.destroy();
        
        this.removeChild(this.areaText);
        this.areaText.destroy();
    }
}