import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateGreenMultiplierHistoryUseCase } from "@/history/application/controller/application/ColorSetting/UpdateGreenMultiplier/usecase/CharacterUpdateGreenMultiplierHistoryUseCase";
import { execute as viewColorSettingGreenMultiplierUseCase } from "@/view/application/usecase/ViewColorSettingGreenMultiplierUseCase";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターのgreen値を更新する
 *              Update the green value of the character
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} green
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
    green: number,
    receiver: boolean = false
): Promise<void> => {

    green = $clamp(green | 0, -100, 100);
    const floatValue = new Float32Array([green / 100]);
    if (character.colorTransform[1] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateGreenMultiplierHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        green,
        receiver
    );

    // greenを更新前の値に戻す
    character.colorTransform[1] = green / 100;

    // Elementの更新
    await viewColorSettingGreenMultiplierUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        green
    );
};