import { $SCREEN_STAGE_ID } from "@/config/ScreenConfig";

/**
 * @description ステージの背景色を更新
 *              Update the background color of the stage
 *
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (color: string): void =>
{
    // canvas
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_ID);

    if (!element) {
        return ;
    }

    element.style.backgroundColor = color;
};