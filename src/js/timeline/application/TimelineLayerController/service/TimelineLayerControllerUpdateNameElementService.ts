import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getTopIndex } from "../../TimelineUtil";

/**
 * @description 指定のLayer IDのレイヤーElementのレイヤー名を更新、表示領域外の時はスキップ
 *              Update the layer name of the layer Element of the specified Layer ID, skipping when it is outside the display area.
 *
 * @param  {number} layer_id
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, name: string): void =>
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

    const nameElements = element.getElementsByClassName("view-text");
    if (!nameElements) {
        return ;
    }

    // 表示Elementを更新
    const nameElement = nameElements[0] as NonNullable<HTMLElement>;
    nameElement.textContent = name;
};