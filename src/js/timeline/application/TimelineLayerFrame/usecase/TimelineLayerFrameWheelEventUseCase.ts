import { execute as timelineHeaderUpdateScrollXUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderUpdateScrollXUseCase";

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

    if (event.deltaX) {
        // 横スクロールして再描画
        return timelineHeaderUpdateScrollXUseCase(event);
    }

    if (event.deltaY) {
        if (event.altKey) {
            //
        } else {
            //
        }
    }
};