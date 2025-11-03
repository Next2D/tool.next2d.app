import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as characterUpdateScaleYHistoryUseCase } from "@/history/application/controller/application/TransformSetting/UpdateScaleY/usecase/CharacterUpdateScaleYHistoryUseCase";
import { execute as viewTransformSettingUpdateScaleYUseCase } from "@/view/controller/TransformSetting/usecase/ViewTransformSettingUpdateScaleYUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description DisplayObjectのyスケールを更新
 *              Update the y scale of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} scale_y
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
    scale_y: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のYスケールを取得
    const beforeScaleY = character.scaleY;

    // 変更がなければ何もしない
    if (beforeScaleY === scale_y) {
        return ;
    }

    // 内部データを更新
    character.scaleY = scale_y;

    // 履歴を登録
    await characterUpdateScaleYHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeScaleY,
        receiver
    );

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // アクティブなら表示を更新
    await viewTransformSettingUpdateScaleYUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};