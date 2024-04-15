import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalTimelineLayerFrameCreateEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameCreateEmptyKeyframeUseCase";
import { execute as timelineLayerFrameUpdateEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateEmptyKeyframe/usecase/TimelineLayerFrameUpdateEmptyKeyframeHistoryUseCase";
import { execute as timelineLayerFrameUpdateKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateKeyframe/usecase/TimelineLayerFrameUpdateKeyframeHistoryUseCase";

/**
 * @description 指定レイヤーの指定キーフレームより前の空きフレームの幅を調整
 *              Adjust the width of the empty frame before the specified keyframe of the specified layer
 *
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
        return false;
    }

    const activeEmptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (activeEmptyCharacter) {
        return false;
    }

    let frame = keyframe - 1;
    while (frame > 0) {

        const characters = layer.getActiveCharacters(frame);
        if (characters.length) {

            const beforeEndFrame = characters[0].endFrame;

            // 終了位置がキーフレームと同じ場合は終了
            if (beforeEndFrame === keyframe) {
                return false;
            }

            // キーフレームを調整
            for (let idx = 0; idx < characters.length; ++idx) {
                const character = characters[idx];
                character.endFrame = keyframe;
            }

            // 履歴に登録
            timelineLayerFrameUpdateKeyframeHistoryUseCase(
                work_space,
                movie_clip,
                layer,
                characters[0].startFrame,
                beforeEndFrame,
                characters[0].endFrame
            );
            return true;
        }

        const emptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (emptyCharacter) {
            // 空のキーフレームを調整
            const beforeEndFrame = emptyCharacter.endFrame;
            // 終了位置がキーフレームと同じ場合は終了
            if (beforeEndFrame === keyframe) {
                return false;
            }

            emptyCharacter.endFrame = keyframe;

            // 履歴に登録
            timelineLayerFrameUpdateEmptyKeyframeHistoryUseCase(
                work_space,
                movie_clip,
                layer,
                emptyCharacter,
                beforeEndFrame
            );
            return false;
        }

        --frame;
    }

    // 新規の空のキーフレームを追加
    externalTimelineLayerFrameCreateEmptyKeyframeUseCase(
        work_space,
        movie_clip,
        layer,
        1,
        keyframe
    );

    return false;
};