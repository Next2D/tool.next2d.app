import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineScrollUpdateYPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { $clamp } from "@/global/GlobalUtil";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";

/**
 * @description 指定indexのレイヤーを削除
 *              Delete layer of specified index
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    index: number
): void => {

    const externalTimeline = new ExternalTimeline(work_space, movie_clip);
    externalTimeline.deactivatedLayer(index);

    // 内部データを削除
    movie_clip.removeLayer(layer);

    if (work_space.active && movie_clip.active) {
        // タイムラインのyスクロールの高さを更新
        timelineScrollUpdateHeightService();

        // y座標のスクロール位置を更新
        timelineScrollUpdateYPositionService();

        // タイムラインを再描画
        timelineLayerBuildElementUseCase();
    }

    const targetLayer: Layer | undefined = movie_clip.layers[
        $clamp(index, 0, movie_clip.layers.length - 1)
    ];

    if (targetLayer) {
        externalTimelineLayerControllerNormalSelectUseCase(
            work_space, movie_clip, targetLayer, movie_clip.currentFrame
        );
    }
};