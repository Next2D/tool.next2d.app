import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 指定のDisplayObjectをスクリーンエリアに追加
 *              Add the specified DisplayObject to the screen area
 *
 * @param  {Character} character
 * @param  {Layer} layer
 * @param  {boolean} [event_register=true]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    character: Character,
    layer: Layer,
    event_register: boolean = true
): Promise<void> => {

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    await character.createElement(element, layer, event_register);
};