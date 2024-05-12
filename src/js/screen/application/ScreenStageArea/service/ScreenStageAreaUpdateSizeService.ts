import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Stage } from "@/core/domain/model/Stage";

/**
 * @description ステージの背後のレイヤーのサイズを更新
 *              Update the size of the layer behind the stage
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (stage: Stage): void =>
{
    const element: HTMLElement | null =  document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    element.style.width  = `${stage.width  * workSpace.scale + window.screen.width}px`;
    element.style.height = `${stage.height * workSpace.scale + window.screen.height}px`;
};