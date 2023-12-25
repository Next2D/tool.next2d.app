import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { $getLeftFrame, $getMaxFrame, $getRightFrame } from "@/timeline/application/TimelineUtil";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineHeaderUpdateScrollXUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderUpdateScrollXUseCase";

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

        // スクロール位置を補正
        switch (true) {

            // 左端に達した処理
            case $getLeftFrame() > frame:
                timelineHeaderUpdateScrollXUseCase(
                    -timelineHeader.clientWidth
                );
                break;

            // 右端に達した処理
            case frame >= $getRightFrame():
                timelineHeaderUpdateScrollXUseCase(
                    timelineHeader.clientWidth
                );
                break;

            // 通常の移動処理
            default:
                // マーカーを移動
                timelineMarkerMovePositionService();
                break;

        }
    });
};