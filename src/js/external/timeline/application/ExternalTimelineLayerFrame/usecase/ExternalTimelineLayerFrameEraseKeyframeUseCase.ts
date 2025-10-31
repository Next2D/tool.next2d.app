import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalTimelineLayerFrameForwardKeyframeService } from "@/external/timeline/application/ExternalTimelineLayerFrame/service/ExternalTimelineLayerFrameForwardKeyframeService";
import { execute as timelineLayerFrameEraseKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/EraseKeyframe/usecase/TimelineLayerFrameEraseKeyframeHistoryUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description キーフレームのフレームを全て削除
 *              Delete all frames of keyframes
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character[]} characters
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    characters: Character[],
    receiver: boolean = false
): Promise<void> => {

    const character = characters[0];

    // 後方のキーフレームを前方へ移動
    externalTimelineLayerFrameForwardKeyframeService(
        layer,
        character.endFrame,
        character.endFrame - character.startFrame
    );

    // 履歴の登録
    // fixed logic
    await timelineLayerFrameEraseKeyframeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        characters,
        receiver
    );

    // 空のキーフレームを削除
    for (let idx = 0; idx < characters.length; ++idx) {
        const character = characters[idx];
        if (!character) {
            continue;
        }
        layer.removeCharacter(character);
    }

    // キャッシュの削除
    cacheRemoveService(work_space, movie_clip.id);
};