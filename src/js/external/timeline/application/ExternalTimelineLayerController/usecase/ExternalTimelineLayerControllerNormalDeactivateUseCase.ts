import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description 指定のレイヤーを非アクティブ下
 *              Update specified layers and frames selectively
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_spcae: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer
): void => {

    // 表示されているプロジェクトであれば表示を更新
    if (work_spcae.active && movie_clip.active) {
        // 対象のElementをアクティブ表示に更新
        // timelineLayerNormalSelectUseCase(layer, frame);
    }

    // 内部情報を更新
    // externalMovieClipSelectedLayerService(movie_clip, layer, frame);
};