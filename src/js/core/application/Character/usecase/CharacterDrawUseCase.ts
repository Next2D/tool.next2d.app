import type { Character } from "@/core/domain/model/Character";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $BITMAP_TYPE } from "@/config/InstanceConfig";
import { execute as characterDrawBitmapUseCase } from "./CharacterDrawBitmapUseCase";

/**
 * @description DisplayObjectを描画
 *              Draw DisplayObject
 *
 * @param  {Character} character
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (character: Character): Promise<HTMLDivElement | null> =>
{
    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(character.libraryId);
    if (!instance) {
        return null;
    }

    switch (instance.type) {

        case $BITMAP_TYPE:
            return await characterDrawBitmapUseCase(workSpace.id, instance, character);

        default:
            break;

    }

    return null;
};