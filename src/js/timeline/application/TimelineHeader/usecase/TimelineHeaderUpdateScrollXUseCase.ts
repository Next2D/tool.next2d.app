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
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (delta: number): boolean =>
{
    if (!delta) {
        return false;
    }

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // 1フレーム目より以前には移動しない
    if (!scene.scrollX && 0 > delta) {
        return false;
    }

    const beforeX = scene.scrollX;
    const afterX  = $clamp(beforeX + delta, 0, $getScrollLimitX());

    // 最大値より右側には移動しない
    if (beforeX === afterX) {
        return false;
    }

    scene.scrollX = afterX;

    // ヘッダーを再構築
    timelineHeaderBuildElementUseCase();

    // マーカーを移動
    timelineMarkerMovePositionService();

    // レイヤーのタイムラインを再描画
    timelineLayerBuildElementUseCase();

    // タイムラインのx移動するスクロールのx座標を更新
    timelineScrollUpdateXPositionService();

    return true;
};