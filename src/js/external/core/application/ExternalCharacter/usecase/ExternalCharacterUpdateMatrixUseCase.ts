import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as characterUpdateMatrixHistoryUseCase } from "@/history/application/core/application/Character/UpdateMatrix/usecase/CharacterUpdateMatrixHistoryUseCase";
import { execute as viewTransformSettingUpdateMatrixUseCase } from "@/view/application/usecase/ViewTransformSettingUpdateMatrixUseCase";

/**
 * @description DisplayObjectの変形行列を更新する
 *              Update the transformation matrix of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number[]} matrix
 * @param  {boolean} [receiver=false]
 * @returns {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    matrix: number[],
    receiver: boolean = false
): Promise<void> => {

    // 変更前の行列を取得
    const beforeMatrix = character.matrix;

    character.matrix.set(matrix);

    // 履歴を登録
    await characterUpdateMatrixHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        Array.from(beforeMatrix),
        receiver
    );

    // 表示を更新
    viewTransformSettingUpdateMatrixUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};