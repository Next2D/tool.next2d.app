import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerFrameClearSelectedElementService } from "../service/TimelineLayerFrameClearSelectedElementService";
import { execute as timelineLayerFrameActiveElementService } from "../service/TimelineLayerFrameActiveElementService";

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

    // フレームElementをアクティブ表示にする
    timelineLayerFrameActiveElementService(element);

    // 選択したElementからフレーム番号を取得
    const frame: number = parseInt(element.dataset.frame as NonNullable<string>);

    // フレーム情報を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();
};