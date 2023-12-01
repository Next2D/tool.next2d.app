import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定のLayer IDのレイヤー名を更新して、表示Elementのclassを更新
 *              Update the layer name of the specified Layer ID and update the class of the display Element.
 *
 * @param  {number} layer_id
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, name: string): void =>
{
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layer_id);

    if (!layer) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById(`layer-name-${layer_id}`);

    if (!element) {
        return ;
    }

    // update name
    layer.name = element.textContent = name;
};