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
    for (const element of targetLayers.values()) {
        element.classList.remove("active");
    }

    // マップを初期化
    targetLayers.clear();
};