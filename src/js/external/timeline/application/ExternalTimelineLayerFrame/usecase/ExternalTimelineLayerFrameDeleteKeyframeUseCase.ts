import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as externalTimelineLayerFrameExtendBehindKeyframeService } from "../service/ExternalTimelineLayerFrameExtendBehindKeyframeService";
import { execute as externalTimelineLayerFrameExtendForwardKeyframeService } from "../service/ExternalTimelineLayerFrameExtendForwardKeyframeService";
import { execute as timelineLayerFrameDeleteKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/DeleteKeyframe/usecase/TimelineLayerFrameDeleteKeyframeHistoryUseCase";

/**
 * @description キーフレームの削除処理
 *              Keyframe deletion process
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character[]} characters
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
    receiver: boolean = false
): void => {

    const character = characters[0];

    // 削除するキーフレーム数
    const numFrames = character.endFrame - character.startFrame;

    // 削除するキーフレーム数が0の場合は終了
    if (character.startFrame > 1) {
        // 前方のフレームを後方に延長
        externalTimelineLayerFrameExtendBehindKeyframeService(
            layer, character.startFrame - 1, numFrames
        );
    } else {
        // 後方のフレームを前方に延長
        externalTimelineLayerFrameExtendForwardKeyframeService(
            layer, character.endFrame, numFrames
        );
    }

    // 履歴に登録
    timelineLayerFrameDeleteKeyframeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        characters,
        receiver
    );

    // キーフレームを削除
    for (let idx = 0; idx < characters.length; ++idx) {
        const character = characters[idx];
        if (!character) {
            continue;
        }
        layer.removeCharacter(character);
    }

    // タイムラインのレイヤー表示を更新
    if (work_space.active && movie_clip.active) {
        timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
    }
};