import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateGreenOffsetHistoryUseCase } from "@/history/application/core/application/Character/UpdateGreenOffset/usecase/CharacterUpdateGreenOffsetHistoryUseCase";
import { execute as viewColorSettingGreenOffsetUseCase } from "@/view/application/usecase/ViewColorSettingGreenOffsetUseCase";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターの緑色オフセット値を更新する
 *              Update the green offset value of the character
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

    green = $clamp(green | 0, -255, 255);
    const floatValue = new Float32Array([green]);
    if (character.colorTransform[4] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateGreenOffsetHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        green,
        receiver
    );
    // greenを更新前の値に戻す
    character.colorTransform[5] = green;

    // Elementの更新
    viewColorSettingGreenOffsetUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        green
    );
};