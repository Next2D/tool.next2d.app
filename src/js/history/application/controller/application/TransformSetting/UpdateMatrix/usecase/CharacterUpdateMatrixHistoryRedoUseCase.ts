import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as viewTransformSettingUpdateMatrixUseCase } from "@/view/application/usecase/ViewTransformSettingUpdateMatrixUseCase";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { $removeLibraryCache } from "@/cache/CacheUtil";

/**
 * @description DisplayObjectの行列を変更後に戻す
 *              Reset the matrix of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} after_matrix
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    keyframe: number,
    depth: number,
    after_matrix: number[]
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    const character = layer.getCharacter(keyframe, depth);
    if (!character) {
        return ;
    }

    // データを更新
    character.matrix.set(after_matrix);

    // 先祖のキャッシュを削除する
    timelineSceneListCacheRemoveService(workSpace);

    // 自分のキャッシュを削除する
    $removeLibraryCache(workSpace.id, movieClip.id);

    // アクティブなら表示を更新
    await viewTransformSettingUpdateMatrixUseCase(
        workSpace,
        movieClip,
        layer,
        character
    );
};