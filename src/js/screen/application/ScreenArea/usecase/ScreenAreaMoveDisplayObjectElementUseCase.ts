import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

/**
 * @description 指定レイヤーの指定DisplayObjectのElementの座標を内部データに合わせる
 *              Adjust the coordinates of the Element of the specified DisplayObject in the specified layer to match the internal data
 *
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, character: Character): void =>
{
    const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
    if (!element) {
        return ;
    }

    element.style.left = `${$getScreenOffsetLeft() + character.globalMinX}px`;
    element.style.top  = `${$getScreenOffsetTop()  + character.globalMinY}px`;
};