import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as timelineLayerFrameCreateEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/usecase/TimelineLayerFrameCreateEmptyKeyframeHistoryUseCase";

/**
 * @description 空のキーフレームを追加
 *              Add an empty keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} start_frame
 * @param  {number} end_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    start_frame: number,
    end_frame: number
): void => {

    const emptyCharacter = new EmptyCharacter();
    emptyCharacter.startFrame = start_frame;
    emptyCharacter.endFrame   = end_frame;
    layer.addEmptyCharacter(emptyCharacter);

    // 履歴に追加
    timelineLayerFrameCreateEmptyKeyframeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        start_frame,
        end_frame
    );
};