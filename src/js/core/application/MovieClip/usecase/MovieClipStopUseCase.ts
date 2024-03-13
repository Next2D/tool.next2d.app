import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineLayerAllClearSelectedElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAllClearSelectedElementUseCase";

/**
 * @description MovieClipの終了処理
 *              Exit Process for MovieClip
 *
 * @param  {MovieClip} movie_clip
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    // 選択中のElementを初期化
    timelineLayerAllClearSelectedElementUseCase(movie_clip);
};