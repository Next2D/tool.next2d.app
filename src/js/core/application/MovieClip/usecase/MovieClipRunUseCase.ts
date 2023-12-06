import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as timelineScrollUpdateXPositionService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateXPositionService";

/**
 * @description MovieClipの起動処理
 *              MovieClip startup process
 *
 * @params {MovieClip} movie_clip
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    // タイムラインのフレーム位置を更新
    timelineFrameUpdateFrameElementService(movie_clip.currentFrame);

    // タイムラインのヘッダーを生成
    timelineHeaderBuildElementUseCase();

    // タイムラインのマーカーの座標をセット
    timelineMarkerMovePositionService();

    // MovieClipのLayerからタイムラインを生成
    timelineLayerBuildElementUseCase();

    // タイムラインのx移動するスクロール幅を更新
    timelineScrollUpdateWidthService();

    // タイムラインのx移動するスクロールのx座標を更新
    timelineScrollUpdateXPositionService();
};