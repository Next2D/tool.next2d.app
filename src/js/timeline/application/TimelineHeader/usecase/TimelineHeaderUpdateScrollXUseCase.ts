import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import {
    $getScrollX,
    $setScrollX
} from "../../TimelineUtil";

/**
 * @description タイムラインのヘッダーエリアのx座標を移動
 *              Move the x-coordinate of the header area of the timeline
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    const delta: number = event.deltaX || event.deltaY;
    if (!delta) {
        return ;
    }

    const scrollX = $getScrollX();
    // 1フレーム目より以前には移動しない
    if (!scrollX && 0 > delta) {
        return ;
    }

    // 最大値より右側には移動しない
    if (scrollX >= Number.MAX_VALUE) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        $setScrollX($clamp(scrollX + delta, 0, Number.MAX_VALUE));

        // ヘッダーを再構築
        timelineHeaderBuildElementUseCase();

        // マーカーを移動
        timelineMarkerMovePositionService();

        // レイヤーのタイムラインを再描画
        timelineLayerBuildElementUseCase();
    });
};