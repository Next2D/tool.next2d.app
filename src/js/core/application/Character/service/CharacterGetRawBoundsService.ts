import type { Character } from "@/core/domain/model/Character";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IBounds } from "@/interface/IBounds";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as characterCalcChildFrameService } from "./CharacterCalcChildFrameService";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";

/**
 * @description キャラクターのmatrix未適用の矩形を返却
 *              Returns the rectangle where the character matrix has not been applied
 *
 * @param  {WorkSpace} work_space
 * @param  {Character} character
 * @param  {number} parent_frame
 * @return {IBounds | null}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    character: Character,
    parent_frame: number = 1
): IBounds | null => {

    const instance = work_space.getLibrary(character.libraryId);
    if (!instance) {
        return null;
    }

    // MovieClip以外はそのまま返却
    if (instance.type !== $MOVIE_CLIP_TYPE) {
        return instance.getRawBounds();
    }

    // MovieClipの場合は子孫のフレーム位置に合わせる
    return (instance as MovieClip).getRawBounds(
        characterCalcChildFrameService(instance as MovieClip, character, parent_frame)
    );
};