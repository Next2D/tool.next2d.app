import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";
import { execute as timelineLayerFrameEraseEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/EraseEmptyKeyframe/usecase/TimelineLayerFrameEraseEmptyKeyframeHistoryUseCase";

/**
 * @description 空のキーフレームのフレームを全て削除
 *              Delete all frames of empty keyframes
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} emptyCharacter
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
    receiver: boolean = false
): Promise<void> => {

    // 後方のキーフレームを前方へ移動
    externalTimelineLayerFrameForwardKeyframeService(
        layer,
        emptyCharacter.endFrame,
        emptyCharacter.endFrame - emptyCharacter.startFrame
    );

    // 履歴の登録
    // fixed logic
    await timelineLayerFrameEraseEmptyKeyframeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        emptyCharacter,
        receiver
    );

    // 空のキーフレームを削除
    layer.removeEmptyCharacter(emptyCharacter);
};