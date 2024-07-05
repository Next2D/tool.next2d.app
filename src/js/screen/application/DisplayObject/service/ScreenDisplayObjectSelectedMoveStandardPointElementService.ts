import { $SCREEN_STANDARD_POINT_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description MovieClipの基準点のElementを移動する
 *              Move the standard point Element of the MovieClip
 *
 * @param  {number} [movement_x=0]
 * @param  {number} [movement_y=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movement_x: number = 0,
    movement_y: number = 0
): void => {

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のelementがない場合は何もしない
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STANDARD_POINT_ID);

    if (!element) {
        return ;
    }

    const scale = workSpace.scale;
    element.style.left = `${element.offsetLeft + movement_x / scale}px`;
    element.style.top  = `${element.offsetTop  + movement_y / scale}px`;
};