import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateRedOffsetHistoryUseCase } from "@/history/application/controller/application/ColorSetting/UpdateRedOffset/usecase/CharacterUpdateRedOffsetHistoryUseCase";
import { execute as viewColorSettingRedOffsetUseCase } from "@/view/application/usecase/ViewColorSettingRedOffsetUseCase";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターの赤色オフセット値を更新する
 *              Update the red offset value of the character
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

    red = $clamp(red | 0, -255, 255);
    const floatValue = new Float32Array([red]);
    if (character.colorTransform[4] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateRedOffsetHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        red,
        receiver
    );

    // redを更新前の値に戻す
    character.colorTransform[4] = red;

    // Elementの更新
    viewColorSettingRedOffsetUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        red
    );
};