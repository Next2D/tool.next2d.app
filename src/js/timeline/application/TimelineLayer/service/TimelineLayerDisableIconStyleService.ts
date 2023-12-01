import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定のLayer IDの表示情報を更新して、表示Elementのclassを更新
 *              Update the display information of the specified Layer ID and update the class of the display Element.
 *
 * @param  {number} layer_id
 * @param  {boolean} disable
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, disable: boolean): void =>
{
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layer_id);

    if (!layer) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById(`layer-disable-icon-${layer_id}`);

    if (!element) {
        return ;
    }

    // update property
    layer.disable = disable;

    // update class
    if (disable) {
        element.classList.remove("icon-disable");
        element.classList.add("icon-active");
    } else {
        element.classList.remove("icon-active");
        element.classList.add("icon-disable");
    }
};