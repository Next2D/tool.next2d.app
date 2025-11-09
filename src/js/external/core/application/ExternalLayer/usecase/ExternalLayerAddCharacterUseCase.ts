import { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as timelineLayerFrameAddKeyframeHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerFrame/AddKeyframe/usecase/TimelineLayerFrameAddKeyframeHistoryUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewTimelineLayerFrameAddKeyFrameUseCase } from "@/view/timeline/TimelineLayerFrame/usecase/ViewTimelineLayerFrameAddKeyFrameUseCase";

/**
 * @description ExternalLayerにキャラクターを追加する
 *              Add a character to ExternalLayer
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @param {Layer} layer
 * @param {ExternalCharacter} external_character
 * @param {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    external_character: ExternalCharacter,
    depth: number = 0,
    receiver: boolean = false
): Promise<void> => {

    const character = new Character(external_character.id);
    character.load(external_character.toObject());
    character.depth = depth;

    // 空のキーフレームがあれば記録に残す
    let emptyCharacterIndex = -1;

    const frame = movie_clip.currentFrame;

    // 空のキーフレームがある場合は情報を引き継いで、空のキーフレームを削除
    const activeEmptyCharacter = layer.getActiveEmptyCharacter(frame);
    if (activeEmptyCharacter) {
        character.startFrame = activeEmptyCharacter.startFrame;
        character.endFrame   = activeEmptyCharacter.endFrame;
        emptyCharacterIndex  = layer.emptyCharacters.indexOf(activeEmptyCharacter);
        layer.removeEmptyCharacter(activeEmptyCharacter);
    } else {
        // 新規のキーフレームレイヤーの最大フレーム以降に登録
        const maxFrame = layer.maxFrame;
        character.startFrame = maxFrame ? maxFrame : 1;
        character.endFrame   = frame + 1;
    }

    // レイヤーに追加
    // fixed logic
    layer.addCharacter(character);

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // 履歴に登録
    await timelineLayerFrameAddKeyframeHistoryUseCase(
        work_space, movie_clip,
        layer, character,
        emptyCharacterIndex, receiver
    );

    // View側の処理
    await viewTimelineLayerFrameAddKeyFrameUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};