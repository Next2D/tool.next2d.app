import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalTimelineLayerFrameCreateEmptyKeyframeUseCase } from "./ExternalTimelineLayerFrameCreateEmptyKeyframeUseCase";
import { execute as timelineLayerFrameUpdateEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/UpdateEmptyKeyframe/usecase/TimelineLayerFrameUpdateEmptyKeyframeHistoryUseCase";

/**
 * @description 指定レイヤーの指定キーフレームより前の空きフレームの幅を調整
 *              Adjust the width of the empty frame before the specified keyframe of the specified layer
 *
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
        return ;
    }

    const activeEmptyCharacter = layer.getActiveEmptyCharacter(keyframe);
    if (activeEmptyCharacter) {
        return ;
    }

    let frame = keyframe - 1;
    while (frame > 0) {

        const characters = layer.getActiveCharacters(frame);
        if (characters.length) {
            // キーフレームを調整
            for (let idx = 0; idx < characters.length; ++idx) {
                const character = characters[idx];
                character.endFrame = keyframe;
            }

            // 履歴に登録
            return ;
        }

        const emptyCharacter = layer.getActiveEmptyCharacter(frame);
        if (emptyCharacter) {
            // 空のキーフレームを調整
            const beforeEndFrame = emptyCharacter.endFrame;
            emptyCharacter.endFrame = keyframe;

            // 履歴に登録
            timelineLayerFrameUpdateEmptyKeyframeHistoryUseCase(
                work_space,
                movie_clip,
                layer,
                emptyCharacter,
                beforeEndFrame
            );
            return ;
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
};