import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定のLayer IDのハイライト情報を更新して、表示Elementのclassを更新
 *              Update the highlight information of the specified Layer ID and update the class of the display Element
 *
 * @param  {number}  layer_id
 * @param  {boolean} light
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, light: boolean): void =>
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

    const layerElement: HTMLElement | null = document
        .getElementById(`layer-id-${layer_id}`);

    if (!layerElement) {
        return ;
    }

    // update property
    layer.light = light;

    // update class
    const span = element.children[0] as NonNullable<HTMLElement>;

    if (light) {
        span.style.display              = "none";
        element.style.backgroundImage   = `url('${layer.getHighlightURL()}')`;
        layerElement.style.borderBottom = `1px solid ${layer.color}`;
    } else {
        span.style.display              = "";
        element.style.backgroundImage   = "";
        layerElement.style.borderBottom = "";
    }
};