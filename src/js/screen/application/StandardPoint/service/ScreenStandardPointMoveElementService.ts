import { $SCREEN_STANDARD_POINT_ID } from "@/config/ScreenConfig";
import { $getStandardPointState } from "../StandardPointUtil";

/**
 * @description MovieClipの基準点のElementを移動する
 *              Move the standard point Element of the MovieClip
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (x: number = 0, y: number = 0): void =>
{
    if ($getStandardPointState() === "hide" || !x && !y) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STANDARD_POINT_ID);

    if (!element) {
        return ;
    }

    if (x) {
        element.style.left = `${element.offsetLeft + x}px`;
    }
    if (y) {
        element.style.top = `${element.offsetTop + y}px`;
    }
};