import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { $getMaxFrame, $getScrollLimitX } from "@/timeline/application/TimelineUtil";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";

/**
 * @description タイムラインのフレームInput Elementのキープレスイベント処理関数
 *              Keypress event processing function for the frame Input Element of the timeline
 *
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
{
    if (event.key !== "Enter") {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    const frame = $clamp(
        parseInt(element.value),
        1, $getMaxFrame()
    );

    const workSpace = $getCurrentWorkSpace();

    const delta = $clamp(
        (frame - 1) * (workSpace.timelineAreaState.frameWidth + 1),
        0, $getScrollLimitX()
    );

    // リセット
    if (delta) {
        workSpace.scene.scrollX = 0;
        timelineScrollUpdateScrollXUseCase(delta);
    } else {
        timelineScrollUpdateScrollXUseCase(-workSpace.scene.scrollX);
    }

    // フレームを更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();

    // 入力終了
    element.value = `${frame}`;
    element.blur();
};