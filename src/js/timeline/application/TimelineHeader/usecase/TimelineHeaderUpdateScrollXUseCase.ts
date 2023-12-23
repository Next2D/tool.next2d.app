import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $FIXED_FRAME_COUNT } from "@/config/TimelineConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateXPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateXPositionService";

/**
 * @description タイムラインのヘッダーエリアのx座標を移動
 *              Move the x-coordinate of the header area of the timeline
 *
 * @param  {number} delta
 * @return {void}
 * @method
 * @public
 */
export const execute = (delta: number): void =>
{
    if (!delta) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // 1フレーム目より以前には移動しない
    if (!scene.scrollX && 0 > delta) {
        return ;
    }

    const limitX = (scene.totalFrame + $FIXED_FRAME_COUNT)
        * workSpace.timelineAreaState.frameWidth - timelineHeader.clientWidth;

    // 最大値より右側には移動しない
    if (scene.scrollX + delta > limitX) {
        return ;
    }

    requestAnimationFrame((): void =>
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