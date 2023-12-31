import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getTopIndex } from "../../TimelineUtil";

/**
 * @description 選択中のレイヤーElementを非アクティブに変更してマップを初期化
 *              Initialize the map by changing the selected Layer Element to inactive
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    const topIndex = $getTopIndex();

    // 選択中のレイヤーElementを非アクティブにする
    const targetLayers = timelineLayer.targetLayers;
    for (const layerId of targetLayers.keys()) {

        const layer: Layer | null = scene.getLayer(layerId);
        if (!layer) {
            continue;
        }

        const index = topIndex + scene.layers.indexOf(layer);
        const element: HTMLElement | undefined = timelineLayer.elements[index];
        if (!element) {
            continue;
        }

        // 非アクティブに更新
        element.classList.remove("active");
    }

    // 初期化
    targetLayers.clear();
};