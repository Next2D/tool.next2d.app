import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { execute as timelineScrollUpdateScrollYUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollYUseCase";
import { execute as timelineFrameWheelEventUseCase } from "@/timeline/application/TimelineFrame/usecase/TimelineFrameWheelEventUseCase";

/**
 * @description タイマーID
 *              Timer ID
 *
 * @type {NodeJS.Timeout}
 * @private
 */
let timerId: NodeJS.Timeout;

/**
 * @description 移動モード、x: 横方向、y: 縦方向
 *              Move mode, x: horizontal, y: vertical
 *
 * @type {string}
 * @private
 */
let mode: string = "";

/**
 * @description タイムラインのWheelEventの実行関数
 *              Execution function of WheelEvent in the timeline
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

    // タイマーをクリア
    clearTimeout(timerId);

    // 移動モードを設定
    if (!mode) {
        mode = event.deltaX ? "x" : "y";
    }

    switch (mode) {

        case "x":
            requestAnimationFrame((): void =>
            {
                // 横スクロールして再描画
                timelineScrollUpdateScrollXUseCase(event.deltaX);
            });
            break;

        case "y":
            if (event.altKey) {
                requestAnimationFrame((): void =>
                {
                    // フレームの幅を更新
                    timelineFrameWheelEventUseCase(event);
                });
            } else {
                // 縦スクロール
                requestAnimationFrame((): void =>
                {
                    // 縦スクロールして再描画
                    timelineScrollUpdateScrollYUseCase(event.deltaY);
                });
            }
            break;

        default:
            break;

    }

    timerId = setTimeout((): void =>
    {
        mode = "";
    }, 60);
};