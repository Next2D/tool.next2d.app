import { $SCREEN_STAGE_ID } from "../../../config/ScreenConfig";
import {
    $setOffsetLeft,
    $setOffsetTop
} from "../../../util/Global";

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

    $setOffsetLeft(element.offsetLeft);
    $setOffsetTop(element.offsetTop);
};