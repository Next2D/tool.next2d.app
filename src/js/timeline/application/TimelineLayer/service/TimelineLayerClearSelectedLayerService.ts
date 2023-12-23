import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

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
    // 選択中のレイヤーElementを非アクティブにする
    const targetLayers = timelineLayer.targetLayers;
    for (const layerId of targetLayers.keys()) {

        const element: HTMLElement | null = document
            .getElementById(`layer-id-${layerId}`);

        if (!element) {
            continue;
        }

        // 非アクティブに更新
        element.classList.remove("active");
    }

    // 初期化
    targetLayers.clear();
};