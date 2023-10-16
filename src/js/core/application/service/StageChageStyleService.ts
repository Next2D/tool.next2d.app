import type { Stage } from "../../domain/model/Stage";
import { $SCREEN_STAGE_ID } from "../../../config/ScreenConfig";

/**
 * @description ステージElementの幅と高さと背景色をセット
 *              Set the width, height and background color of the stage Element
 *
 * @param  {Stage} stage
 * @return {void}
 * @method
 * @public
 */
export const execute = (stage: Stage): void =>
{
    // canvas
    const element: HTMLElement | null = document.getElementById($SCREEN_STAGE_ID);
    if (!element) {
        return ;
    }

    element.style.width           = `${stage.width}px`;
    element.style.height          = `${stage.height}px`;
    element.style.backgroundColor = stage.bgColor;
};