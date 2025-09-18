import { $SCREEN_REFERENCE_POINT_ID } from "@/config/ScreenConfig";
import { $getReferencePointState } from "../ReferencePointUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

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
export const execute = (movement_x: number = 0, movement_y: number = 0): void =>
{
    if ($getReferencePointState() === "hide"
        || !movement_x && !movement_y
    ) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_REFERENCE_POINT_ID);

    if (!element) {
        return ;
    }

    if (movement_x) {
        referenceSetting.x += movement_x;
        element.style.left = `${element.offsetLeft + movement_x}px`;
    }
    if (movement_y) {
        referenceSetting.y += movement_y;
        element.style.top = `${element.offsetTop + movement_y}px`;
    }
};