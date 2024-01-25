import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerNormalSelectUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerNormalSelectUseCase";
import { execute as externalMovieClipSelectedLayerService } from "@/external/core/application/ExternalMovieClip/service/ExternalMovieClipSelectedLayerService";

/**
 * @description 指定のレイヤーとフレームを選択状に更新
 *              Update specified layers and frames selectively
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_spcae: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    frame: number
): void => {

    // 表示されているプロジェクトであれば表示を更新
    if (work_spcae.active && movie_clip.active) {
        // 対象のElementをアクティブ表示に更新
        timelineLayerNormalSelectUseCase(layer, frame);
    }

    // 内部情報を更新
    externalMovieClipSelectedLayerService(movie_clip, layer, frame);
};