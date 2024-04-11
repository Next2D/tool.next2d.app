import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as externalTimelineLayerFrameSplitToEmptyUseCase } from "./ExternalTimelineLayerFrameSplitToEmptyUseCase";
import { Character } from "@/core/domain/model/Character";

/**
 * @description 指定したレイヤーの指定フレームにキーフレームを追加、キーフレームがない場合は空のキーフレームを追加
 *              Add a keyframe to the specified frame of the specified layer
 *              or add an empty keyframe if there is no keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} keyframe
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    keyframe: number
): void => {

    // 指定のキーフレームにアクティブなDisplayObjectが存在しない場合は空のキーフレームを追加
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (!activeCharacters.length) {
        externalTimelineLayerFrameSplitToEmptyUseCase(
            work_space,
            movie_clip,
            layer,
            keyframe
        );
        return ;
    }

    // 既に空のキーフレームがある場合は何もしない
    if (activeCharacters[0].startFrame === keyframe) {
        return ;
    }

    for (let idx = 0; idx < activeCharacters.length; ++idx) {

        const character = activeCharacters[idx];
        if (!character) {
            continue;
        }

        const newCharacter = new Character();
        layer.addCharacter(newCharacter);

        // 複製を読み込む
        newCharacter.load(character.toObject());

        // 開始・終了フレームを設定
        newCharacter.startFrame = keyframe;
        newCharacter.endFrame   = character.endFrame;

        // 既存のキーフレームを分割
        character.endFrame = keyframe;
    }

    // 履歴に追加
    // timelineLayerFrameSplitKeyframeToEmptyHistoryUseCase(
    //     work_space,
    //     movie_clip,
    //     layer,
    //     newEmptyCharacter,
    //     keyframe,
    //     character.startFrame,
    //     receiver
    // );
};