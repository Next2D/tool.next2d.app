import { $FIXED_FRAME_COUNT } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderUpdateScrollXUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderUpdateScrollXUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

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
        const scene     = workSpace.scene;

        const clientWidth: number = timelineHeader.clientWidth;
        const totalFrame: number  = scene.totalFrame + $FIXED_FRAME_COUNT;

        // スクロールバーの幅を算出
        const scale: number = clientWidth / (totalFrame * workSpace.timelineAreaState.frameWidth);

        timelineHeaderUpdateScrollXUseCase(Math.floor(event.movementX / scale));
    });
};