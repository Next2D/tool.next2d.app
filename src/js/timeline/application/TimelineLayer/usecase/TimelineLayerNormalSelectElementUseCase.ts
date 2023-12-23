import { execute as timelineLayerClearSelectedLayerService } from "../service/TimelineLayerClearSelectedLayerService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 通常レイヤー選択の処理関数（Alt、Shiftなし）
 *              Processing function for normal layer selection (without Alt and Shift)
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 選択中のレイヤーElementを非アクティブにする
    timelineLayerClearSelectedLayerService();

    const layerId = parseInt(element.dataset.layerId as NonNullable<string>);
    timelineLayer.targetLayers.set(layerId, element);

    // フレームをアクティブに更新
    element.classList.add("active");
};