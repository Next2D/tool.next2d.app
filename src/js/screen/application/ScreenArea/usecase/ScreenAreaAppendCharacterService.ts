import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { Character } from "@/core/domain/model/Character";

/**
 * @description 指定のDisplayObjectをスクリーンエリアに追加
 *              Add the specified DisplayObject to the screen area
 *
 * @param  {Character} character
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (character: Character): Promise<void> =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const div = await character.draw();
    if (!div) {
        return ;
    }

    element.appendChild(div);
};