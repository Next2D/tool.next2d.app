import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameExtendBehindKeyframeService } from "../service/ExternalTimelineLayerFrameExtendBehindKeyframeService";
import { execute as externalTimelineLayerFrameExtendForwardKeyframeService } from "../service/ExternalTimelineLayerFrameExtendForwardKeyframeService";
import { execute as timelineLayerFrameDeleteEmptyKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/DeleteEmptyKeyframe/usecase/TimelineLayerFrameDeleteEmptyKeyframeHistoryUseCase";

/**
 * @description 空のキーフレームの削除処理
 *              Empty keyframe deletion process
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} empty_character
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
    receiver: boolean = false
): void => {

    // 削除するキーフレーム数
    const numFrames = empty_character.endFrame - empty_character.startFrame;

    // 削除するキーフレーム数が0の場合は終了
    if (empty_character.startFrame > 1) {
        // 前方のフレームを後方に延長
        externalTimelineLayerFrameExtendBehindKeyframeService(
            layer, empty_character.startFrame - 1, numFrames
        );
    } else {
        // 後方のフレームを前方に延長
        externalTimelineLayerFrameExtendForwardKeyframeService(
            layer, empty_character.endFrame, numFrames
        );
    }

    // 履歴に登録
    timelineLayerFrameDeleteEmptyKeyframeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        empty_character,
        receiver
    );

    // 空のキーフレームを削除
    layer.removeEmptyCharacter(empty_character);

    // タイムラインのレイヤー表示を更新
    if (work_space.active && movie_clip.active) {
        timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
    }
};