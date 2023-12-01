import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定のLayer IDのロック情報を更新して、表示Elementのclassを更新
 *              Update the lock information of the specified Layer ID and update the class of the display Element.
 *
 * @param  {number} layer_id
 * @param  {boolean} lock
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, lock: boolean): void =>
{
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layer_id);

    if (!layer) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById(`layer-lock-icon-${layer_id}`);

    if (!element) {
        return ;
    }

    // update property
    layer.lock = lock;

    // update class
    if (lock) {
        element.classList.remove("icon-disable");
        element.classList.add("icon-active");
    } else {
        element.classList.remove("icon-active");
        element.classList.add("icon-disable");
    }
};