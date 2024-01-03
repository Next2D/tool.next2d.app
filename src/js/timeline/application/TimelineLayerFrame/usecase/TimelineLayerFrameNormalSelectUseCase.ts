import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerFrameClearSelectedElementService } from "../service/TimelineLayerFrameClearSelectedElementService";
import { execute as timelineLayerFrameActiveElementService } from "../service/TimelineLayerFrameActiveElementService";
import { execute as timelineLayerClearSelectedLayerService } from "@/timeline/application/TimelineLayer/service/TimelineLayerClearSelectedLayerService";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 通常のフレームエリア選択の処理関数（Alt、Shiftなし）
 *              Processing function for normal frame area selection (without Alt and Shift)
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 選択中のフレームElementを非アクティブにする
    timelineLayerFrameClearSelectedElementService();

    // 選択中のレイヤーElementを非アクティブにする
    // fixed logic
    timelineLayerClearSelectedLayerService();

    // フレームElementをアクティブ表示にする
    timelineLayerFrameActiveElementService(element);

    // 選択中の内部情報を初期化
    // fixed logic
    timelineLayer.clearSelectedTarget();

    // 選択したElementからフレーム番号を取得
    const frame: number = parseInt(element.dataset.frame as NonNullable<string>);

    // フレーム情報を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();

    // レイヤーElementをアクティブ表示
    const layerElement = timelineLayer.getLayerElementFromElement(element);
    if (layerElement) {
        timelineLayerActiveElementService(layerElement);
    }
};