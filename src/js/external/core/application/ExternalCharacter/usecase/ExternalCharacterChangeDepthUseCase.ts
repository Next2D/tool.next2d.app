import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $clamp } from "@/global/GlobalUtil";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewCharacterChangeDepthUseCase } from "@/view/core/Character/usecase/ViewCharacterChangeDepthUseCase";
import { execute as characterChangeDepthHistoryUseCase } from "@/history/application/core/application/Character/ChangeDepth/usecase/CharacterChangeDepthHistoryUseCase";

/**
 * @description 指定キャラクターの深度変更
 *              Change Depth of Specified Character
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} depth
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    depth: number,
    receiver: boolean = false
): Promise<void> => {

    const maxDepth = layer.getActiveCharacters(character.startFrame).length;
    depth = $clamp(depth, 0,
        maxDepth ? maxDepth - 1 : 0
    );

    // 変更がなければ終了
    if (character.depth === depth) {
        return ;
    }

    // 深度変更を履歴に追加
    // fixed logic
    characterChangeDepthHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        depth,
        receiver
    );

    // レイヤーからキャラクターを一旦削除し、深度を変更してから再追加
    layer.removeCharacter(character);
    character.depth = depth;
    layer.addCharacter(character);

    // 選択深度を更新
    movie_clip.selectedDepths.set(
        movie_clip.layers.indexOf(layer), [depth]
    );

    // キャッシュ削除
    cacheRemoveService(work_space, movie_clip.id);

    // Viewを更新
    await viewCharacterChangeDepthUseCase(
        work_space,
        movie_clip
    );
};