import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定のLayer IDのカラー情報を更新して、表示Elementのclassを更新
 *              Update the color information of the specified Layer ID and update the class of the display Element.
 *
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, color: string): void =>
{
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layer_id);

    if (!layer) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById(`layer-light-icon-${layer_id}`);

    if (!element) {
        return ;
    }

    // update property
    layer.color = color;

    const colorElement = element.children[0] as NonNullable<HTMLElement>;
    colorElement.style.backgroundColor = color;
};