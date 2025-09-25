import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as characterUpdateScaleXHistoryUseCase } from "@/history/application/core/application/Character/UpdateScaleX/usecase/CharacterUpdateScaleXHistoryUseCase";
import { execute as viewTransformSettingUpdateScaleXUseCase } from "@/view/application/usecase/ViewTransformSettingUpdateScaleXUseCase";

/**
 * @description DisplayObjectのxスケールを更新
 *              Update the x scale of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} scale_x
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
    scale_x: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のXスケールを取得
    const beforeScaleX = character.scaleX;

    // 変更がなければ何もしない
    if (beforeScaleX === scale_x) {
        return ;
    }

    // 内部データを更新
    character.scaleX = scale_x;

    // 履歴を登録
    await characterUpdateScaleXHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeScaleX,
        receiver
    );

    // 表示を更新
    await viewTransformSettingUpdateScaleXUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};