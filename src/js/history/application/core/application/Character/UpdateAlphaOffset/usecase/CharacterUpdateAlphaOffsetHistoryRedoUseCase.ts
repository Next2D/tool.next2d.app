import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as viewColorSettingAlphaOffsetUseCase } from "@/view/application/usecase/ViewColorSettingAlphaOffsetUseCase";

/**
 * @description DisplayObjectの行列を変更後に戻す
 *              Reset the matrix of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} after_alpha
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
    after_alpha: number
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
    character.colorTransform[3] = Math.floor(after_alpha) / 100;

    // アクティブなら表示を更新
    viewColorSettingAlphaOffsetUseCase(
        workSpace,
        movieClip,
        layer,
        character,
        after_alpha
    );
};