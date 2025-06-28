import { Bounds, Container, Graphics, TextStyle } from 'pixi.js';
import { TEXT_STYLE } from '../consts/CText';
import { CustomTextStyle } from '../utils/CustomTextStyle';

export class BaseElement extends Container {
    protected background:Graphics = new Graphics();

    constructor() {
        super();
        this.draw();
    }

    protected draw(): void {
       this.addChild(this.background);
    }

    protected getFont():TextStyle {
        let textStyle = new CustomTextStyle();
        textStyle.updateStyle(TEXT_STYLE);
        return textStyle;
    }

    public getWidth():number {
        return this.background.width;
    }

    public getHeight():number {
        return this.background.height;
    }

    public getBounds():Bounds {
        return this.background.getBounds();
    }

    public destroy(): void {
        this.removeChild(this.background);
        this.background.destroy();
    }
}