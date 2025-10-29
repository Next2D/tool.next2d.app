import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IBlendMode } from "@/interface/IBlendMode";
import { execute as characterUpdateBlendModeHistoryUseCase } from "@/history/application/controller/application/BlendModeSetting/UpdateBlendMode/usecase/CharacterUpdateBlendModeHistoryUseCase";
import { execute as viewBlendModeSettingBlendModeUseCase } from "@/view/application/usecase/ViewBlendModeSettingBlendModeUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description キャラクターのblendModeを更新する
 *              Update the blendMode of the character
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {IBlendMode} blend_mode
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
    blend_mode: IBlendMode,
    receiver: boolean = false
): Promise<void> => {

    // 変更がなければ終了
    if (character.blendMode === blend_mode) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateBlendModeHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        blend_mode,
        receiver
    );

    // blendModeを更新
    character.blendMode = blend_mode;

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // Elementの更新
    await viewBlendModeSettingBlendModeUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        blend_mode
    );
};