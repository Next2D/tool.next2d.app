import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { execute as bitmapCreateDisplayObjectElementUseCase } from "@/core/application/Bitmap/usecase/BitmapCreateDisplayObjectElementUseCase";
import { execute as movieClipCreateDisplayObjectElementUseCase } from "@/core/application/MovieClip/usecase/MovieClipCreateDisplayObjectElementUseCase";
import { execute as shapeCreateDisplayObjectElementUseCase } from "@/core/application/Shape/usecase/ShapeCreateDisplayObjectElementUseCase";
import { execute as videoCreateDisplayObjectElementUseCase } from "@/core/application/Video/usecase/VideoCreateDisplayObjectElementUseCase";
import {
    $BITMAP_TYPE,
    $MOVIE_CLIP_TYPE,
    $SHAPE_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

/**
 * @description DisplayObjectを描画して、DivElementとして返却
 *              Draw the DisplayObject and return it as a DivElement
 *
 * @param  {Character} character
 * @param  {HTMLElement} element
 * @param  {Layer} layer
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

    let div = null;
    switch (instance.type) {

        case $VIDEO_TYPE:
            div = await videoCreateDisplayObjectElementUseCase(
                workSpace, instance, element, layer, character
            );
            break;

        case $BITMAP_TYPE:
            div = await bitmapCreateDisplayObjectElementUseCase(
                workSpace.id, instance, element, layer, character
            );
            break;

        case $MOVIE_CLIP_TYPE:
            div = await movieClipCreateDisplayObjectElementUseCase(
                workSpace.id, instance, element, layer, character
            );
            break;

        case $SHAPE_TYPE:
            div = await shapeCreateDisplayObjectElementUseCase(
                workSpace.id, instance, element, layer, character
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