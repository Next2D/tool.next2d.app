import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import {
    $getLeftFrame,
    $getTopIndex
} from "../../TimelineUtil";

/**
 * @description 選択中のフレームElementを非アクティブに更新してマップデータを初期化
 *              Update selected frame Element to inactive and initialize map data
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scene = $getCurrentWorkSpace().scene;

    const topIndex  = $getTopIndex();
    const leftFrame = $getLeftFrame();
    for (const [layerId, frames] of timelineLayer.targetLayers) {

        const layer: Layer | null = scene.getLayer(layerId);
        if (!layer) {
            continue;
        }

        const index = topIndex + scene.layers.indexOf(layer);
        const layerElement: HTMLElement | undefined = timelineLayer.elements[index];

        const element = layerElement.lastElementChild as NonNullable<HTMLElement>;

        const children = element.children;
        for (let idx: number = 0; idx < frames.length; ++idx) {

            const frameIndex = frames[idx] - leftFrame;

            const node: HTMLElement | undefined = children[frameIndex] as HTMLElement;
            if (!node) {
                continue;
            }

            node.classList.remove("frame-active");
        }
    }
};