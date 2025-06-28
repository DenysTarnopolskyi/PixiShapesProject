import { BUTTON_COLOR, GLOW_GREEN_COLOR, GLOW_RED_COLOR, TEXT_COLOR } from "./CColor";
import { TEXT_SIZE } from "./CGame";

export const TITLE_TEXT = "Generation Area";
export const TITLE_SHAPE_NUMBERS_TEXT = "Number of current shapes: ";
export const TITLE_AREA_TEXT = "Surface area occupied by shapes: ";

export const BUTTON_NUMBER_TEXT = "Number of shapes per sec: ";
export const BUTTON_GRAVITY_TEXT = "Gravity value: ";

export const TIME_TEXT = " sec";
export const SM_TEXT = " px²";
export const WIN_TEXT = "YOU WIN! \n \nCLICK TO START NEW ROUND!";
export const LOSE_TEXT = "YOU LOSE! \nTIME IS LEFT!\nCLICK TO START NEW ROUND!";

export const TEXT_STYLE =               {   fontFamily: 'Arial',
                                            fontSize: TEXT_SIZE,
                                            fontStyle: 'italic',
                                            fontWeight: 'bold',
                                            align: 'center',
                                            fill: TEXT_COLOR,
                                            wordWrap: true,
                                            wordWrapWidth: 600 };

export const TEXT_WITH_BORDER_STYLE =   {   fontFamily: 'Arial',
                                            fontSize: TEXT_SIZE,
                                            fontStyle: 'italic',
                                            fontWeight: 'bold',
                                            align: 'center',
                                            fill: TEXT_COLOR,
                                            wordWrap: true,
                                            wordWrapWidth: 600,
                                            stroke: 6,
                                            strokeThickness: GLOW_GREEN_COLOR };

export const TEXT_STYLE2 =              {   fontFamily: 'Arial',
                                            fontSize: TEXT_SIZE,
                                            fontStyle: 'italic',
                                            fontWeight: 'bold',
                                            align: 'center',
                                            fill: TEXT_COLOR, 
                                            wordWrap: true,
                                            wordWrapWidth: 600,
                                            padding: 4,
                                            stroke: 4,
                                            strokeThickness: GLOW_RED_COLOR };

export const BUTTON_TEXT_STYLE =        {   fontFamily: 'Arial',
                                            fontSize: TEXT_SIZE,
                                            fontStyle: 'italic',
                                            fontWeight: 'bold',
                                            align: 'center',
                                            fill: BUTTON_COLOR, 
                                            wordWrap: true,
                                            wordWrapWidth: 600,
                                            padding: 2,
                                            wordWrapHeight: 40,
                                            stroke: TEXT_COLOR,
                                            strokeThickness: 2 };