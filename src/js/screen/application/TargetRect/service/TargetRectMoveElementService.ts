import { $SCREEN_TARGET_RECT_ID } from "@/config/ScreenConfig";

/**
 * @description 選択範囲のElementを移動
 *              Move the selected range Element
 *
 * @param {number} [movement_x=0]
 * @param {number} [movement_y=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (movement_x: number = 0, movement_y: number = 0): void =>
{
    // 選択範囲も移動
    const element: HTMLElement | null = document
        .getElementById($SCREEN_TARGET_RECT_ID);

    if (!element) {
        return ;
    }

    element.style.left = `${element.offsetLeft + movement_x}px`;
    element.style.top  = `${element.offsetTop  + movement_y}px`;
};