import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateRedMultiplierHistoryUseCase } from "@/history/application/controller/application/ColorSetting/UpdateRedMultiplier/usecase/CharacterUpdateRedMultiplierHistoryUseCase";
import { execute as viewColorSettingRedMultiplierUseCase } from "@/view/controller/ColorSetting/usecase/ViewColorSettingRedMultiplierUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターのred値を更新する
 *              Update the red value of the character
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} red
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
    red: number,
    receiver: boolean = false
): Promise<void> => {

    red = $clamp(red | 0, -100, 100);
    const floatValue = new Float32Array([red / 100]);
    if (character.colorTransform[0] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateRedMultiplierHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        red,
        receiver
    );

    // redを更新前の値に戻す
    character.colorTransform[0] = red / 100;

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // Elementの更新
    await viewColorSettingRedMultiplierUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        red
    );
};