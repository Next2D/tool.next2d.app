import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerFrameSplitEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitEmptyKeyframe/usecase/TimelineLayerFrameSplitEmptyKeyframeHistoryUseCase";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

/**
 * @description 空のキーフレームを分割
 *              Split empty keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} empty_character
 * @param  {number} keyframe
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    empty_character: EmptyCharacter,
    keyframe: number,
    receiver: boolean = false
): void => {

    // 既に空のキーフレームがある場合は何もしない
    if (empty_character.startFrame === keyframe) {
        return ;
    }

    // 空いた部分に新しい空のキーフレームを追加
    const newEmptyCharacter = new EmptyCharacter();
    newEmptyCharacter.startFrame = keyframe;
    newEmptyCharacter.endFrame   = empty_character.endFrame;
    layer.addEmptyCharacter(newEmptyCharacter);

    // 既存の空のキーフレームを分割
    empty_character.endFrame = keyframe;

    // 履歴に追加
    timelineLayerFrameSplitEmptyKeyframeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        empty_character,
        newEmptyCharacter,
        receiver
    );
};