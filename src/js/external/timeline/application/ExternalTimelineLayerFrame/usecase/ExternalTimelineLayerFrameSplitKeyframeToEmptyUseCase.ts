import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerFrameSplitKeyframeToEmptyHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitKeyframeToEmpty/usecase/TimelineLayerFrameSplitKeyframeToEmptyHistoryUseCase";
import { Character } from "@/core/domain/model/Character";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

/**
 * @description キーフレームを分割して空のキーフレームを追加
 *              Split the keyframe and add an empty keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character[]} characters
 * @param  {number} keyframe
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    characters: Character[],
    keyframe: number,
    receiver: boolean = false
): Promise<void> => {

    // 既に空のキーフレームがある場合は何もしない
    if (characters[0].startFrame === keyframe) {
        return ;
    }

    const character = characters[0];

    // 空いた部分に新しいキーフレームを追加
    const newEmptyCharacter = new EmptyCharacter();
    newEmptyCharacter.startFrame = keyframe;
    newEmptyCharacter.endFrame   = character.endFrame;
    layer.addEmptyCharacter(newEmptyCharacter);

    // 既存のキーフレームを分割
    for (let idx = 0; idx < characters.length; ++idx) {
        character.endFrame = keyframe;
    }

    // 履歴に追加
    await timelineLayerFrameSplitKeyframeToEmptyHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        newEmptyCharacter,
        keyframe,
        character.startFrame,
        receiver
    );
};