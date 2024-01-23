import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";

/**
 * @description レイヤーのアクティブを初期化して指定のフレームを選択する
 *              Initialize the layer active and select the specified frame
 *
 * @param {number} frame
 * @method
 * @public
 */
export const execute = (frame: number): void =>
{
    // 選択したレイヤー・フレーム Elementを初期化
    timelineLayerAllClearSelectedElementService();

    // フレームの表示を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();
};