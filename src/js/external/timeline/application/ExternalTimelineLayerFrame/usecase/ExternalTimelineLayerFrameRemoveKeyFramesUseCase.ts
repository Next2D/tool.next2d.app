import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";
import { execute as timelineLayerFrameRemoveKeyFramesHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/RemoveKeyFrames/usecase/TimelineLayerFrameRemoveKeyFramesHistoryUseCase";

/**
 * @description キーフレームのフレームを削除
 *              Delete the frame of the keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character[]} characters
 * @param  {number} num_frames
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    characters: Character[],
    num_frames: number,
    receiver: boolean = false
): void => {

    // 変更前の最終フレームをセット
    const beforeEndFrame = characters[0].endFrame;

    // 後方のキーフレームを前方へ移動
    // fixed logic
    externalTimelineLayerFrameForwardKeyframeService(
        layer,
        beforeEndFrame,
        num_frames
    );

    // 終了位置を更新
    for (let idx = 0; idx < characters.length; ++idx) {
        const activeCharacter = characters[idx];
        activeCharacter.endFrame -= num_frames;
    }

    // 履歴を登録
    timelineLayerFrameRemoveKeyFramesHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        characters[0].startFrame, // keyframe
        beforeEndFrame,
        characters[0].endFrame, // after end frame
        receiver
    );
};