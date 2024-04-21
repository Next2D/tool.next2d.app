import { MovieClip } from "@/core/domain/model/MovieClip";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerAllSelectedElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAllSelectedElementUseCase";

/**
 * @description 指定のフレームを選択状態に更新
 *              Update the specified frame to the selected state
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {array} frames
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    frames: number[]
): Promise<void> => {

    // 選択中のレイヤーがなければ終了
    if (!movie_clip.selectedLayers.length) {
        return ;
    }

    let frame = frames.length > 1
        ? movie_clip.selectedFrameObject.end
        : frames[0];

    if (!frame) {
        frame = frames[0];
    }

    // 指定のフレームを選択状態に更新
    if (work_space.active && movie_clip.active) {
        timelineLayerAllSelectedElementUseCase(movie_clip, frames);
    }

    // 内部情報を更新
    movie_clip.currentFrame = frame;
};