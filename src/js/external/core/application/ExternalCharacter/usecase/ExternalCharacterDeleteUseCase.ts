import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as characterDeleteHistoryUseCase } from "@/history/application/core/application/Character/Delete/usecase/CharacterDeleteHistoryUseCase";
import { execute as viewCharacterDeleteUseCase } from "@/view/core/Character/usecase/ViewCharacterDeleteUseCase";
import { execute as timelineLayerAddFrameUpdateLayerStyleUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerAddFrameUpdateLayerStyleUseCase";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";

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
    character.parentMovieClipId = -1;

    // キャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // キーフレームが空で、空のキーフレームが存在しない場合は、空のキーフレームを追加
    const activeCharacters = layer.getActiveCharacters(character.startFrame);
    if (!activeCharacters.length) {

        const activeEmptyCharacter = layer
            .getActiveEmptyCharacter(character.startFrame);

        if (!activeEmptyCharacter) {

            const emptyCharacter = new EmptyCharacter();
            emptyCharacter.startFrame = character.startFrame;
            emptyCharacter.endFrame   = character.endFrame;
            layer.addEmptyCharacter(emptyCharacter);

            // タイムラインにフレームを追加
            if (work_space.active && movie_clip.active) {
                timelineLayerAddFrameUpdateLayerStyleUseCase(movie_clip, layer);
            }
        }
    }

    if (!work_space.active) {
        return ;
    }

    if (movie_clip.active) {
        // 選択を初期化
        movie_clip.clearSelectedDepths();

        // スクリーンを再描画
        await screenAreaRedrawUseCase(movie_clip);
    }

    // Viewを更新
    await viewCharacterDeleteUseCase(
        work_space,
        movie_clip
    );
};