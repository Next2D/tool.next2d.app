import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as characterDeleteHistoryUseCase } from "@/history/application/core/application/Character/Delete/usecase/CharacterDeleteHistoryUseCase";
import { execute as viewCharacterDeleteUseCase } from "@/view/core/Character/usecase/ViewCharacterDeleteUseCase";

/**
 * @description Characterをレイヤーから削除
 *              Remove the Character from the Layer
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @param {Layer} layer
 * @param {Character} character
 * @param {boolean} receiver
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

    // Viewを更新
    await viewCharacterDeleteUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};