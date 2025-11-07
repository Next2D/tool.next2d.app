import type { Character } from "@/core/domain/model/Character";
import { execute as screenAreaGetElementFromCharacterIdService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromCharacterIdService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

/**
 * @description 指定レイヤーの指定DisplayObjectのElementの座標を内部データに合わせる
 *              Adjust the coordinates of the Element of the specified DisplayObject in the specified layer to match the internal data
 *
 * @param  {Character} character
 * @return {void}
 * @method
 * @public
 */
export const execute = (character: Character): void =>
{
    const element = screenAreaGetElementFromCharacterIdService(character.id);
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const bounds = character.getBounds(movieClip.currentFrame, true);
    if (!bounds) {
        return ;
    }

    element.style.left = `${$getScreenOffsetLeft() + Math.ceil(bounds.xMin)}px`;
    element.style.top  = `${$getScreenOffsetTop()  + Math.ceil(bounds.yMin)}px`;
};