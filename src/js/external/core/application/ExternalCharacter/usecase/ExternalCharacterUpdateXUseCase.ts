import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as characterUpdateXHistoryUseCase } from "@/history/application/core/application/Character/UpdateX/usecase/CharacterUpdateXHistoryUseCase";
import { execute as viewUpdateAfterXUseCase } from "@/view/application/usecase/ViewUpdateAfterXUseCase";

/**
 * @description DisplayObjectのx座標を更新
 *              Update the x coordinate of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} x
 * @param  {boolean} [receiver=false]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    x: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のx座標を取得
    const beforeX = character.x;

    // 変更がなければ何もしない
    if (beforeX === x) {
        return ;
    }

    // 内部データを更新
    character.x = x;

    // 履歴を登録
    await characterUpdateXHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeX,
        receiver
    );

    // viewエリアの表示を更新
    await viewUpdateAfterXUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};