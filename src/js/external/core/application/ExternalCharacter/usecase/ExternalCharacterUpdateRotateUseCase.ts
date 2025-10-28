import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as characterUpdateRotateHistoryUseCase } from "@/history/application/controller/application/TransformSetting/UpdateRotate/usecase/CharacterUpdateRotateHistoryUseCase";
import { execute as viewTransformSettingUpdateRotateUseCase } from "@/view/application/usecase/ViewTransformSettingUpdateRotateUseCase";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { $removeLibraryCache } from "@/cache/CacheUtil";

/**
 * @description DisplayObjectのxスケールを更新
 *              Update the x scale of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} rotation
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
    rotation: number,
    receiver: boolean = false
): Promise<void> => {

    // 変更前の回転を取得
    const beforeRotation = character.rotation;

    // 変更がなければ何もしない
    if (beforeRotation === rotation) {
        return ;
    }

    // 内部データを更新
    character.rotation = rotation;

    // 履歴を登録
    await characterUpdateRotateHistoryUseCase(
        work_space,
        movie_clip,
        layer,
        character,
        beforeRotation,
        receiver
    );

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(work_space);

    // 自分のキャッシュを削除する
    $removeLibraryCache(work_space.id, movie_clip.id);

    // アクティブなら表示を更新
    await viewTransformSettingUpdateRotateUseCase(
        work_space,
        movie_clip,
        layer,
        character
    );
};