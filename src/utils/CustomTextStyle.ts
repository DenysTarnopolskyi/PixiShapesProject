import { TextStyle } from 'pixi.js';

export class CustomTextStyle extends TextStyle {

    public updateStyle(options = {}):void {
        Object.assign(this, options);
    }
}