import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as viewTransformSettingUpdateYUseCase } from "@/view/controller/TransformSetting/usecase/ViewTransformSettingUpdateYUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description DisplayObjectのy座標を変更前に戻す
 *              Reset the y coordinate of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} before_y
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
    before_y: number
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
    character.y = before_y;

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // アクティブなら表示を更新
    await viewTransformSettingUpdateYUseCase(
        workSpace,
        movieClip,
        layer,
        character
    );
};