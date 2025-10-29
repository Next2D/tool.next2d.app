import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateBlueMultiplierHistoryUseCase } from "@/history/application/controller/application/ColorSetting/UpdateBlueMultiplier/usecase/CharacterUpdateBlueMultiplierHistoryUseCase";
import { execute as viewColorSettingBlueMultiplierUseCase } from "@/view/application/usecase/ViewColorSettingBlueMultiplierUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターのblue値を更新する
 *              Update the blue value of the character
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} blue
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
    blue: number,
    receiver: boolean = false
): Promise<void> => {

    blue = $clamp(blue | 0, -100, 100);
    const floatValue = new Float32Array([blue / 100]);
    if (character.colorTransform[2] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateBlueMultiplierHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        blue,
        receiver
    );

    // alphaを更新前の値に戻す
    character.colorTransform[2] = blue / 100;

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // Elementの更新
    await viewColorSettingBlueMultiplierUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        blue
    );
};