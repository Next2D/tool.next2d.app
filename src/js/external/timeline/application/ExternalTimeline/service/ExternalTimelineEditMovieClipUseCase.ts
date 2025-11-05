import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";

/**
 * @description 指定のMovieClipを編集モードに切り替える
 *              Switch the specified MovieClip to edit mode
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @return {MovieClip}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip
): Promise<MovieClip | void> => {

    if (!work_space.active) {
        return ;
    }

    const scene = work_space.scene;
    if (!scene || scene.id === movie_clip.id) {
        return ;
    }

    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    // 起動中のMovieClipを停止して、指定のMovieClipに入れ替える
    scene.stop();

    work_space.scene = movie_clip;

    if (!work_space.active) {
        return ;
    }

    await movie_clip.run();

    return movie_clip;
};