import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as viewColorSettingGreenOffsetUseCase } from "@/view/application/usecase/ViewColorSettingGreenOffsetUseCase";

/**
 * @description DisplayObjectの緑色を変更前に戻す
 *              Reset the green offset of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} before_green
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
    before_green: number
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
    character.colorTransform[5] = Math.floor(before_green);

    // アクティブなら表示を更新
    viewColorSettingGreenOffsetUseCase(
        workSpace,
        movieClip,
        layer,
        character,
        before_green
    );
};