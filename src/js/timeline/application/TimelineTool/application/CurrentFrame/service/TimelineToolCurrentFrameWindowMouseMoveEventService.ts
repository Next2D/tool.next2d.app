import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { $getMaxFrame } from "@/timeline/application/TimelineUtil";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";

/**
 * @description タイムラインのフレームInputElement上のマウスムーブ処理関数
 *              Mouse move processing function on a frame InputElement in the timeline
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    $setCursor("ew-resize");

    requestAnimationFrame((): void =>
    {
        const frame = $clamp(
            timelineFrame.currentFrame + event.movementX,
            1, $getMaxFrame()
        );

        // フレーム位置を移動
        timelineFrameUpdateFrameElementService(frame);

        // マーカーを移動
        timelineMarkerMovePositionService();
    });
};