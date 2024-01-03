import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerFrameUpdateAllElementUseCase } from "@/timeline/application/TimelineLayerFrame/usecase/TimelineLayerFrameUpdateAllElementUseCase";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateXPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateXPositionService";
import { $getLeftFrame, $getScrollLimitX } from "../../TimelineUtil";

/**
 * @description タイムラインのx座標を移動
 *              Move the x-coordinate of the timeline
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

    const beforeFrame = $getLeftFrame();

    // スクロール位置を更新
    scene.scrollX = afterX;

    // タイムラインのx移動するスクロールのx座標を更新
    timelineScrollUpdateXPositionService();

    // フレーム移動がなければ終了
    if (beforeFrame === $getLeftFrame()) {
        return true;
    }

    // ヘッダーを再構築
    timelineHeaderBuildElementUseCase();

    // マーカーを移動
    timelineMarkerMovePositionService();

    // フレームElementを再描画
    timelineLayerFrameUpdateAllElementUseCase();

    return true;
};