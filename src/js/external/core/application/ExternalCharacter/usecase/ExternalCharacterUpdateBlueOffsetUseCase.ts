import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateBlueOffsetHistoryUseCase } from "@/history/application/controller/application/ColorSetting/UpdateBlueOffset/usecase/CharacterUpdateBlueOffsetHistoryUseCase";
import { execute as viewColorSettingBlueOffsetUseCase } from "@/view/application/usecase/ViewColorSettingBlueOffsetUseCase";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターの青色オフセット値を更新する
 *              Update the blue offset value of the character
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

    blue = $clamp(blue | 0, -255, 255);
    const floatValue = new Float32Array([blue]);
    if (character.colorTransform[6] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateBlueOffsetHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        blue,
        receiver
    );

    // blueを更新前の値に戻す
    character.colorTransform[6] = blue;

    // Elementの更新
    await viewColorSettingBlueOffsetUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        blue
    );
};