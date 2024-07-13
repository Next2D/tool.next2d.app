import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { execute as bitmapCreateDisplayObjectElementUseCase } from "../../Bitmap/usecase/BitmapCreateDisplayObjectElementUseCase";
import { execute as movieClipCreateDisplayObjectElementUseCase } from "../../MovieClip/usecase/MovieClipCreateDisplayObjectElementUseCase";
import {
    $BITMAP_TYPE,
    $MOVIE_CLIP_TYPE
} from "@/config/InstanceConfig";

/**
 * @description DisplayObjectを描画して、DivElementとして返却
 *              Draw the DisplayObject and return it as a DivElement
 *
 * @param  {Character} character
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {boolean} [event_register=true]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    character: Character,
    element: HTMLElement,
    layer: Layer,
    event_register: boolean = true
): Promise<HTMLDivElement | null> => {

    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(character.libraryId);
    if (!instance) {
        return null;
    }

    let div = null;
    switch (instance.type) {

        case $BITMAP_TYPE:
            div = await bitmapCreateDisplayObjectElementUseCase(
                workSpace.id, instance, element,
                layer, character, event_register
            );
            break;

        case $MOVIE_CLIP_TYPE:
            div = await movieClipCreateDisplayObjectElementUseCase(
                workSpace.id, instance, element,
                layer, character, event_register
            );
            break;

        default:
            break;

    }

    if (layer.lock && div
        && !div.classList.contains("disabled")
    ) {
        div.classList.add("disabled");
    }

    return div;
};