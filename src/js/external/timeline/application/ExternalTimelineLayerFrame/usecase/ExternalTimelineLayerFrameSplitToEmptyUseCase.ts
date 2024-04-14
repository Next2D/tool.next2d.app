import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as externalTimelineLayerFrameCreateEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameCreateEmptyKeyframeUseCase";
import { execute as externalTimelineLayerFrameSplitEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameSplitEmptyKeyframeUseCase";
import { execute as externalTimelineLayerFrameSplitKeyframeToEmptyUseCase } from "./ExternalTimelineLayerFrameSplitKeyframeToEmptyUseCase";

/**
 * @description 指定したレイヤーの指定フレームに空のキーフレームを追加
 *              Add an empty keyframe to the specified frame of the specified layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} keyframe
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    keyframe: number
): boolean => {

    // 指定のキーフレームにアクティブなキャラクターがあれば終了
    const activeCharacters = layer.getActiveCharacters(keyframe);
    if (activeCharacters.length) {
        externalTimelineLayerFrameSplitKeyframeToEmptyUseCase(
            work_space,
            movie_clip,
            layer,
            activeCharacters,
            keyframe
        );
        return true;
    }

    const activeEmptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (activeEmptyCharacter) {

        // 空のキーフレームを分割
        externalTimelineLayerFrameSplitEmptyKeyframeUseCase(
            work_space,
            movie_clip,
            layer,
            activeEmptyCharacter,
            keyframe
        );

        return false;
    }

    // 新規の空のキーフレームを追加
    externalTimelineLayerFrameCreateEmptyKeyframeUseCase(
        work_space,
        movie_clip,
        layer,
        keyframe,
        keyframe + 1
    );

    return false;
};