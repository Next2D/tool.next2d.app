import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineScrollUpdateScrollYUseCase } from "./TimelineScrollUpdateScrollYUseCase";

/**
 * @description タイムラインのy座標に移動するスクロールの移動処理
 *              Movement process for scrolls that move to the y-coordinate of the timeline
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

        const clientHeight: number = timelineLayer.clientHeight;

        // スクロールバーの高さを算出
        const height = workSpace.timelineAreaState.frameHeight;
        const scale  = clientHeight / (workSpace.scene.layers.length * height);

        timelineScrollUpdateScrollYUseCase(Math.floor(event.movementY / scale));
    });
};