import type { Character } from "@/core/domain/model/Character";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

/**
 * @description 指定したDisplayObjectのElementをStageAreaから削除
 *              Remove the Element of the specified DisplayObject from the StageArea
 *
 * @param {Character} character
 * @return {void}
 * @method
 * @public
 */
export const execute = (character: Character): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const elements = element.querySelectorAll(".display-object");
    const displayObjectElement = elements[character.depth];
    if (!displayObjectElement) {
        return ;
    }

    // elementを削除
    displayObjectElement.remove();
};