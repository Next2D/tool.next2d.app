import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as characterDeleteHistoryUseCase } from "@/history/application/core/application/Character/Delete/usecase/CharacterDeleteHistoryUseCase";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";

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

    if (!work_space.active) {
        return ;
    }

    // 配置しているelementを削除
    if (movie_clip.active) {
        const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
        if (element) {
            element.remove();
        }
    }

    // Viewを更新
};