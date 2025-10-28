import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as characterUpdateYHistoryUseCase } from "@/history/application/controller/application/TransformSetting/UpdateY/usecase/CharacterUpdateYHistoryUseCase";
import { execute as viewTransformSettingUpdateYUseCase } from "@/view/application/usecase/ViewTransformSettingUpdateYUseCase";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { $removeLibraryCache } from "@/cache/CacheUtil";

/**
 * @description DisplayObjectのx座標を更新
 *              Update the x coordinate of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} y
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
    y: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前のx座標を取得
    const beforeY = character.y;

    // 変更がなければ何もしない
    if (beforeY === y) {
        return ;
    }

    // 内部データを更新
    character.y = y;

    // 履歴を登録
    await characterUpdateYHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeY,
        receiver
    );

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(work_space);

    // 自分のキャッシュを削除する
    $removeLibraryCache(work_space.id, movie_clip.id);

    // アクティブなら表示を更新
    await viewTransformSettingUpdateYUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};