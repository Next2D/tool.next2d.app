import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IBlendMode } from "@/interface/IBlendMode";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as viewBlendModeSettingBlendModeUseCase } from "@/view/application/usecase/ViewBlendModeSettingBlendModeUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";

/**
 * @description DisplayObjectのブレンドモードを変更前に戻す
 *              Reset the blend mode of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} before_blend_mode
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
    before_blend_mode: IBlendMode
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
    character.blendMode = before_blend_mode;

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(workSpace, movieClip.id);

    // アクティブなら表示を更新
    await viewBlendModeSettingBlendModeUseCase(
        workSpace,
        movieClip,
        layer,
        character,
        before_blend_mode
    );
};