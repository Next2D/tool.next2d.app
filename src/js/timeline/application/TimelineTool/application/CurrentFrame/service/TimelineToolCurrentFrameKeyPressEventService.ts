import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { $getMaxFrame } from "@/timeline/application/TimelineUtil";
import { execute as timelineHeaderUpdateScrollXUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderUpdateScrollXUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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

    workSpace.scene.scrollX = 0;
    timelineHeaderUpdateScrollXUseCase(
        (frame - 1) * (workSpace.timelineAreaState.frameWidth + 1)
    );

    // フレームを更新
    timelineFrameUpdateFrameElementService(frame);

    // 入力終了
    element.value = `${frame}`;
    element.blur();
};