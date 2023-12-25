import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateXPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateXPositionService";
import { $getScrollLimitX } from "../../TimelineUtil";

/**
 * @description タイムラインのヘッダーエリアのx座標を移動
 *              Move the x-coordinate of the header area of the timeline
 *
 * @param  {number} delta
 * @return {number}
 * @method
 * @public
 */
export const execute = (delta: number): number =>
{
    if (!delta) {
        return -1;
    }

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // 1フレーム目より以前には移動しない
    if (!scene.scrollX && 0 > delta) {
        return -1;
    }

    const limitX = $getScrollLimitX();

    // 最大値より右側には移動しない
    if (scene.scrollX + delta > limitX) {
        return -1;
    }

    return requestAnimationFrame((): void =>
    {
        scene.scrollX = $clamp(scene.scrollX + delta, 0, limitX);

        // ヘッダーを再構築
        timelineHeaderBuildElementUseCase();

        // マーカーを移動
        timelineMarkerMovePositionService();

        // レイヤーのタイムラインを再描画
        timelineLayerBuildElementUseCase();

        // タイムラインのx移動するスクロールのx座標を更新
        timelineScrollUpdateXPositionService();
    });
};