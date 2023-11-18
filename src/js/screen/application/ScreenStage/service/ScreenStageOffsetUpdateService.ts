import { $SCREEN_STAGE_ID } from "../../../../config/ScreenConfig";
import {
    $setScreenOffsetLeft,
    $setScreenOffsetTop
} from "../../../../global/GlobalUtil";

/**
 * @description ステージの背後のレイヤーのサイズを更新
 *              Update the size of the layer behind the stage
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null =  document
        .getElementById($SCREEN_STAGE_ID);

    if (!element) {
        return ;
    }

    $setScreenOffsetLeft(element.offsetLeft);
    $setScreenOffsetTop(element.offsetTop);
};