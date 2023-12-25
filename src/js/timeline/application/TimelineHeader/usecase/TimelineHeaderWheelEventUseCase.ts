import { execute as timelineHeaderUpdateScrollXUseCase } from "./TimelineHeaderUpdateScrollXUseCase";
import { execute as timelineFrameWheelEventUseCase } from "@/timeline/application/TimelineFrame/usecase/TimelineFrameWheelEventUseCase";

/**
 * @description タイムラインのヘッダーエリアでのWheelEventの実行関数
 *              Execution function of WheelEvent in the header area of the timeline
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    if (event.altKey) {
        requestAnimationFrame((): void =>
        {
            // フレームの幅を更新
            timelineFrameWheelEventUseCase(event);
        });

    } else {
        requestAnimationFrame((): void =>
        {
            // ヘッダーをスクロールして再描画
            timelineHeaderUpdateScrollXUseCase(event.deltaX || event.deltaY);
        });
    }
};