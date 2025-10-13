import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateAlphaMultiplierHistoryUseCase } from "@/history/application/controller/application/ColorSetting/UpdateAlphaMultiplier/usecase/CharacterUpdateAlphaMultiplierHistoryUseCase";
import { execute as viewColorSettingAlphaMultiplierUseCase } from "@/view/application/usecase/ViewColorSettingAlphaMultiplierUseCase";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターのアルファ値を更新する
 *              Update the alpha value of the character
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} alpha
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
    alpha: number,
    receiver: boolean = false
): Promise<void> => {

    alpha = $clamp(alpha | 0, 0, 100);
    const floatValue = new Float32Array([alpha / 100]);
    if (character.colorTransform[3] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateAlphaMultiplierHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        alpha,
        receiver
    );

    // alphaを更新前の値に戻す
    character.colorTransform[3] = alpha / 100;

    // Elementの更新
    viewColorSettingAlphaMultiplierUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        alpha
    );
};