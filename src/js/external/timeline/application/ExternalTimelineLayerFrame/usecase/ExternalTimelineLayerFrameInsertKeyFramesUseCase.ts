import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { execute as externalTimelineLayerFrameBehindKeyframeService } from "../service/ExternalTimelineLayerFrameBehindKeyframeService";
import { execute as timelineLayerFrameInsertKeyFramesHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/InsertKeyFrames/usecase/TimelineLayerFrameInsertKeyFramesHistoryUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";

/**
 * @description キーフレームにフレームを挿入
 *              Insert frames into a keyframe
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} num_frame
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    characters: Character[],
    num_frame: number,
    receiver: boolean = false
): Promise<void> => {

    // 追加するフレーム数分、後ろにずらす
    externalTimelineLayerFrameBehindKeyframeService(
        layer,
        characters[0].endFrame,
        num_frame
    );

    // フレーム幅を拡張
    for (let idx = 0; idx < characters.length; ++idx) {
        const character = characters[idx];
        character.endFrame += num_frame;
    }

    // 履歴に追加
    await timelineLayerFrameInsertKeyFramesHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        characters[0].startFrame,
        num_frame,
        receiver
    );

    if (work_space.active && movie_clip.active) {
        // タイムラインのレイヤー表示を更新
        timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
    }
};