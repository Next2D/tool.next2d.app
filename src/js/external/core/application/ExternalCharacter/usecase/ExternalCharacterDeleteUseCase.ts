import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as characterDeleteHistoryUseCase } from "@/history/application/core/application/Character/Delete/usecase/CharacterDeleteHistoryUseCase";
import { execute as viewCharacterDeleteUseCase } from "@/view/core/Character/usecase/ViewCharacterDeleteUseCase";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as externalTimelineLayerFrameCreateEmptyKeyframeUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameCreateEmptyKeyframeUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

/**
 * @description Characterをレイヤーから削除
 *              Remove the Character from the Layer
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {boolean} receiver
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    receiver: boolean = false
): Promise<void> => {

    // 履歴を登録
    // fixed logic
    await characterDeleteHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        receiver
    );

    // レイヤーからキャラクターを削除
    // fixed logic
    layer.removeCharacter(character);

    // キャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // 選択を初期化
    movie_clip.clearSelectedDepths();

    if (!work_space.active) {
        return ;
    }

    if (movie_clip.active) {
        const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
        if (element) {
            element.remove();
        }

        // キーフレームが空で、空のキーフレームが存在しない場合は、空のキーフレームを追加
        if (!layer.characters.length) {

            const activeEmptyCharacter = layer
                .getActiveEmptyCharacter(movie_clip.currentFrame);

            if (!activeEmptyCharacter) {

                const emptyCharacter = new EmptyCharacter();
                emptyCharacter.startFrame = character.startFrame;
                emptyCharacter.endFrame   = character.endFrame;
                layer.addEmptyCharacter(emptyCharacter);

                // タイムラインにフレームを追加
                timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
            }
        }
    }

    // Viewを更新
    await viewCharacterDeleteUseCase(
        work_space,
        movie_clip
    );
};