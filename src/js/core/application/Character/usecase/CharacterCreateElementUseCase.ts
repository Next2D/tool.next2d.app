import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $BITMAP_TYPE } from "@/config/InstanceConfig";
import { execute as bitmapCreateDisplayObjectElementUseCase } from "../../Bitmap/usecase/BitmapCreateDisplayObjectElementUseCase";

/**
 * @description DisplayObjectを描画して、DivElementとして返却
 *              Draw the DisplayObject and return it as a DivElement
 *
 * @param  {Character} character
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    character: Character,
    element: HTMLElement,
    layer: Layer
): Promise<HTMLDivElement | null> => {

    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(character.libraryId);
    if (!instance) {
        return null;
    }

    switch (instance.type) {

        case $BITMAP_TYPE:
            return await bitmapCreateDisplayObjectElementUseCase(
                workSpace.id, instance, element, layer, character
            );

        default:
            break;

    }

    return null;
};