import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineFrameUpdateFrameWidthService } from "../service/TimelineFrameUpdateFrameWidthService";
import { execute as timelineHeaderWindowResizeUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as timelineLayerWindowResizeUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { execute as timelineMarkerUpdateWidthService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerUpdateWidthService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import {
    $TIMELINE_MIN_FRAME_WIDTH_SIZE,
    $TIMELINE_MAX_FRAME_WIDTH_SIZE
} from "@/config/TimelineConfig";

/**
 * @description フレーム幅のホイールイベント処理関数
 *              Frame width wheel event processing function
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    const deltaY = event.deltaY;
    if (!deltaY) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    // フレームの幅を更新
    const timelineAreaState = workSpace.timelineAreaState;
    if ($TIMELINE_MIN_FRAME_WIDTH_SIZE > timelineAreaState.frameWidth + deltaY) {
        return ;
    }

    if (timelineAreaState.frameWidth + deltaY > $TIMELINE_MAX_FRAME_WIDTH_SIZE) {
        return ;
    }

    const width: number = timelineAreaState.frameWidth + deltaY;

    // フレーム幅を更新
    timelineFrameUpdateFrameWidthService(width);

    // マーカーの幅を更新
    timelineMarkerUpdateWidthService(width);

    // マーカー位置を更新
    timelineMarkerMovePositionService();

    // ヘッダーを再描画
    timelineHeaderWindowResizeUseCase();

    // レイヤーを再描画
    timelineLayerWindowResizeUseCase();
};