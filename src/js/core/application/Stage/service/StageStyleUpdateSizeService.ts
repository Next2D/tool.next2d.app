import { $SCREEN_STAGE_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "../../CoreUtil";

/**
 * @description ステージElementの幅と高さを更新
 *              Update the width and height of the stage Element
 *
 * @param  {number} [width=0]
 * @param  {number} [height=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    width: number = 0,
    height: number = 0
): void => {

    // canvas
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    if (!workSpace) {
        return ;
    }

    // 幅変更があれば更新
    if (width) {
        element.style.width = `${width * workSpace.scale}px`;
    }

    // 高さ変更があれば更新
    if (height) {
        element.style.height = `${height * workSpace.scale}px`;
    }
};