import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description 選択中のレイヤーにキーフレームを追加
 *              Add a keyframe to the selected layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip
): void => {

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(work_space, movie_clip);

    // キーフレームを追加
    externalTimeline
        .convertToKeyframes(movie_clip.currentFrame);
};