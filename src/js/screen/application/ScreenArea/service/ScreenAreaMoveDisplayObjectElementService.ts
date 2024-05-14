import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
export const execute = (
    layer: Layer,
    character: Character
): void => {

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    // 選択中のElementを取得して移動
    const elements = element.querySelectorAll(`.layer-id-${layer.id}`);

    const displayElement = elements[character.depth] as HTMLElement;
    if (!displayElement) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    displayElement.style.left = `${$getScreenOffsetLeft() + character.x * workSpace.scale}px`;
    displayElement.style.top  = `${$getScreenOffsetTop()  + character.y * workSpace.scale}px`;
};