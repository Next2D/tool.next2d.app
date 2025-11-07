import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewCharacterChangeDepthUseCase } from "@/view/core/Character/usecase/ViewCharacterChangeDepthUseCase";

/**
 * @description DisplayObjectの進度を変更前に戻す
 *              Undo the depth change of a DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} before_depth
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
    before_depth: number
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

    // 進度を入れ替える
    layer.removeCharacter(character);
    character.depth = before_depth;
    layer.addCharacter(character);

    // キャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // Viewを更新
    await viewCharacterChangeDepthUseCase(
        workSpace,
        movieClip
    );
};