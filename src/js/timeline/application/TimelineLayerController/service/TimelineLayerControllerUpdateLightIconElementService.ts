import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getTopIndex } from "../../TimelineUtil";

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
    const scene = $getCurrentWorkSpace().scene;

    const layer: Layer | null = scene.getLayer(layer_id);
    if (!layer) {
        return ;
    }

    // 表示領域にElementがなければ終了
    const index = $getTopIndex() + scene.layers.indexOf(layer);
    if (!(index in timelineLayer.elements)) {
        return ;
    }

    // レイヤー本体の下部のボーダー表示を更新
    const layerElement = timelineLayer.elements[index] as NonNullable<HTMLElement>;

    layerElement.style.borderBottom = light
        ? `1px solid ${layer.color}`
        : "";

    // ハイライトElementの表示を更新
    const elements = layerElement.getElementsByClassName("timeline-layer-light-one");
    if (elements) {
        const lightElement = elements[0] as NonNullable<HTMLElement>;
        const span = lightElement.children[0] as NonNullable<HTMLElement>;

        if (light) {
            span.style.display                 = "none";
            lightElement.style.backgroundImage = `url('${layer.getHighlightURL()}')`;
        } else {
            span.style.display                 = "";
            lightElement.style.backgroundImage = "";
        }
    }
};