import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description DisplayObjectを非アクティブ状態に更新
 *              Update the DisplayObject to the inactive state
 *
 * @param  {Layer} layer
 * @param  {array} depths
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, depths: number[]): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);
    if (!element) {
        return ;
    }

    const displayObjects = element
        .querySelectorAll(`.container-layer-id-${layer.id}`);

    for (let idx = 0; idx < depths.length; idx++) {

        const depth = depths[idx];

        const displayObject = displayObjects[depth] as HTMLElement | null;
        if (!displayObject || !displayObject.classList.contains("active")) {
            continue;
        }

        displayObject.classList.remove("active");
    }
};