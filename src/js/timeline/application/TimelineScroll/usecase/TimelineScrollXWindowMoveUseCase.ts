import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getMaxFrame } from "../../TimelineUtil";

/**
 * @description タイムラインのx座標に移動するスクロールの移動処理
 *              Movement process for scrolls that move to the x-coordinate of the timeline
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // 遅延実行
    requestAnimationFrame((): void =>
    {
        const workSpace = $getCurrentWorkSpace();

        const clientWidth: number = timelineHeader.clientWidth;

        // スクロールバーの幅を算出
        const width = workSpace.timelineAreaState.frameWidth + 1;
        const scale: number = clientWidth / ($getMaxFrame() * width);

        timelineScrollUpdateScrollXUseCase(Math.floor(event.movementX / scale));
    });
};