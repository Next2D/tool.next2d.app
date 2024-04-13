import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameExtendBehindKeyframeService } from "../service/ExternalTimelineLayerFrameExtendBehindKeyframeService";
import { execute as externalTimelineLayerFrameExtendForwardKeyframeService } from "../service/ExternalTimelineLayerFrameExtendForwardKeyframeService";

/**
 * @description 空のキーフレームの削除処理
 *              Empty keyframe deletion process
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {EmptyCharacter} empty_character
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    empty_character: EmptyCharacter
): void => {

    const numFrames = empty_character.endFrame - empty_character.startFrame;

    // 削除するキーフレーム数が0の場合は終了
    if (empty_character.startFrame > 1) {
        const keyframe = empty_character.startFrame - 1;
        externalTimelineLayerFrameExtendBehindKeyframeService(
            layer, keyframe, numFrames
        );
    } else {
        // 後方のフレームを前方に移動
        const keyframe = empty_character.endFrame;
        externalTimelineLayerFrameExtendForwardKeyframeService(
            layer, keyframe, numFrames
        );
    }

    // TODO 履歴に登録

    // 空のキーフレームを削除
    layer.removeEmptyCharacter(empty_character);

    // タイムラインのレイヤー表示を更新
    if (work_space.active && movie_clip.active) {
        timelineLayerAddFrameUpdateLayerStyleUseCase(work_space, movie_clip, layer);
    }
};