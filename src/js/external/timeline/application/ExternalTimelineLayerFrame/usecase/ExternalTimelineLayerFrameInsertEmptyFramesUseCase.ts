import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as externalTimelineLayerFrameBehindKeyframeService } from "../service/ExternalTimelineLayerFrameBehindKeyframeService";
import { execute as timelineLayerFrameInsertEmptyFramesHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/InsertEmptyFrames/usecase/TimelineLayerFrameInsertEmptyFramesHistoryUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";

/**
 * @description 空のキーフレームにフレームを挿入
 *              Insert frames into an empty keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} num_frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    emptyCharacter: EmptyCharacter,
    num_frame: number,
    receiver: boolean = false
): void => {

    // 追加するフレーム数分、後ろにずらす
    externalTimelineLayerFrameBehindKeyframeService(
        layer,
        emptyCharacter.endFrame,
        num_frame
    );

    // フレーム幅を拡張
    emptyCharacter.endFrame += num_frame;

    // 履歴に追加
    timelineLayerFrameInsertEmptyFramesHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        emptyCharacter,
        num_frame,
        receiver
    );

    if (work_space.active && movie_clip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
    }
};