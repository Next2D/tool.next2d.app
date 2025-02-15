import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";
import { execute as timelineLayerFrameRemoveEmptyFramesHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/RemoveEmptyFrames/usecase/TimelineLayerFrameRemoveEmptyFramesHistoryUseCase";

/**
 * @description 空のキーフレームのフレームを削除
 *              Delete the frame of the empty keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} emptyCharacter
 * @param  {number} num_frames
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    emptyCharacter: EmptyCharacter,
    num_frames: number,
    receiver: boolean = false
): Promise<void> => {

    // 後方のキーフレームを前方へ移動
    // fixed logic
    externalTimelineLayerFrameForwardKeyframeService(
        layer,
        emptyCharacter.endFrame,
        num_frames
    );

    // 変更前の最終フレームをセット
    const beforeEndFrame = emptyCharacter.endFrame;

    // 終了位置を更新
    emptyCharacter.endFrame -= num_frames;

    // 履歴を登録
    await timelineLayerFrameRemoveEmptyFramesHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        emptyCharacter,
        beforeEndFrame,
        receiver
    );
};