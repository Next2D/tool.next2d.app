import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as externalTimelineLayerFrameCreateEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameCreateEmptyKeyframeUseCase";
import { execute as timelineLayerFrameSplitEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/SplitEmptyKeyframe/usecase/TimelineLayerFrameSplitEmptyKeyframeHistoryUseCase";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

/**
 * @description 指定したレイヤーの指定フレームに空のキーフレームを追加
 *              Add an empty keyframe to the specified frame of the specified layer
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

    // 指定のキーフレームにアクティブなキャラクターがあれば終了
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (activeCharacters.length) {
        // TODO ここで何か処理をする
        return ;
    }

    const activeEmptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (activeEmptyCharacter) {

        // 既に空のキーフレームがある場合は何もしない
        if (activeEmptyCharacter.startFrame === keyframe) {
            return ;
        }

        // 既存の空のキーフレームを分割
        const beforeEndframe = activeEmptyCharacter.endFrame;
        activeEmptyCharacter.endFrame = keyframe;

        // 空いた部分に新しい空のキーフレームを追加
        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = keyframe;
        emptyCharacter.endFrame   = beforeEndframe;
        layer.addEmptyCharacter(emptyCharacter);

        // 履歴に追加
        timelineLayerFrameSplitEmptyKeyframeHistoryUseCase(
            work_space,
            movie_clip,
            layer,
            activeEmptyCharacter,
            emptyCharacter
        );

        return ;
    }

    externalTimelineLayerFrameCreateEmptyKeyframeUseCase(
        work_space,
        movie_clip,
        layer,
        keyframe,
        keyframe + 1
    );
};