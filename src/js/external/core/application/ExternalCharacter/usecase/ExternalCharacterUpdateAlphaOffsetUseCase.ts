import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterUpdateAlphaOffsetHistoryUseCase } from "@/history/application/core/application/Character/UpdateAlphaOffset/usecase/CharacterUpdateAlphaOffsetHistoryUseCase";
import { execute as viewColorSettingAlphaOffsetUseCase } from "@/view/application/usecase/ViewColorSettingAlphaOffsetUseCase";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description キャラクターのアルファオフセット値を更新する
 *              Update the alpha offset value of the character
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

    alpha = $clamp(alpha | 0, -255, 255);
    const floatValue = new Float32Array([alpha]);
    if (character.colorTransform[7] === floatValue[0]) {
        return ;
    }

    // 履歴を残す
    // fixed logic 変更前に実行
    await characterUpdateAlphaOffsetHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        alpha,
        receiver
    );

    // alphaを更新前の値に戻す
    character.colorTransform[7] = alpha;

    // Elementの更新
    viewColorSettingAlphaOffsetUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        alpha
    );
};