import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description レイヤーロックに合わせてスクリーンに配置された、DisplayObjectのElementのEvent Styleを更新
 *              Update the Event Style of the Element of the DisplayObject placed on the screen according to the layer lock
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);
    if (!element) {
        return ;
    }

    const displayObjects = element
        .querySelectorAll(`.layer-id-${layer.id}`);

    const length = displayObjects.length;
    if (layer.lock) {
        for (let idx = 0; idx < length; ++idx) {
            const displayObject = displayObjects[idx] as HTMLElement;
            if (displayObject.classList.contains("disabled")) {
                continue;
            }
            displayObject.classList.add("disabled");
        }
    } else {
        for (let idx = 0; idx < length; ++idx) {
            const displayObject = displayObjects[idx] as HTMLElement;
            if (!displayObject.classList.contains("disabled")) {
                continue;
            }
            displayObject.classList.remove("disabled");
        }
    }
};