import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";

/**
 * @description DisplayObjectの名前を変更後に戻す
 *              Reset the name of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {string} after_name
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    keyframe: number,
    depth: number,
    after_name: string
): void => {

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
    character.name = after_name;

    // アクティブなら表示を更新
    if (workSpace.active
        && movieClip.active
        && movieClip.selectedDepths.size
    ) {
        const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
        if (!activeCharacters.length) {
            return ;
        }

        const values = movieClip.selectedDepths.values().next().value as number[];
        const currentCharacter = activeCharacters[values[0] as number];
        if (!currentCharacter) {
            return ;
        }

        if (currentCharacter !== character) {
            return ;
        }

        objectSettingUpdateNameService(character.name);
    }
};