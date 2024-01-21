import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のLayer IDのハイライト情報を更新して、表示Elementのclassを更新
 *              Update the highlight information of the specified Layer ID and update the class of the display Element
 *
 * @param  {Layer}  layer
 * @param  {boolean} light
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, light: boolean): void =>
{
    // 表示領域にElementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // レイヤー本体の下部のボーダー表示を更新
    layerElement.style.borderBottom = light
        ? `1px solid ${layer.color}`
        : "";

    // ハイライトElementの表示を更新
    const elements = layerElement.getElementsByClassName("timeline-layer-light-one");
    if (!elements || !elements.length) {
        return ;
    }

    const lightElement = elements[0] as NonNullable<HTMLElement>;
    const span = lightElement.children[0] as NonNullable<HTMLElement>;

    if (light) {
        span.style.display                 = "none";
        lightElement.style.backgroundImage = `url('${layer.getHighlightURL()}')`;
    } else {
        span.style.display                 = "";
        lightElement.style.backgroundImage = "";
    }
};