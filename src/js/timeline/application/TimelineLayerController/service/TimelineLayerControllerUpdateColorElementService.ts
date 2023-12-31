import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getTopIndex } from "../../TimelineUtil";

/**
 * @description 指定のLayer IDのハイライトカラーElementを更新、表示領域外の時はスキップ
 *              Update the highlight color Element of the specified Layer ID, skipping when it is outside the display area.
 *
 * @param  {string} color
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, color: string): void =>
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

    const element: HTMLElement | undefined = timelineLayer.elements[index];
    if (!element) {
        return ;
    }

    const lightElements = element
        .getElementsByClassName("timeline-layer-light-one");

    if (!lightElements) {
        return ;
    }

    const lightElement = lightElements[0] as NonNullable<HTMLElement>;
    const span = lightElement.children[0] as NonNullable<HTMLElement>;
    span.style.backgroundColor = color;
};