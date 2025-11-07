import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

/**
 * @description 指定レイヤーIDと深度から要素を取得する
 *              Get the element from the specified layer ID and depth
 *
 * @param  {string} character_id
 * @return {HTMLElement | null}
 * @method
 * @public
 */
export const execute = (character_id: string): HTMLElement | null =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return null;
    }

    const elements = element
        .querySelectorAll(`.character-id-${character_id}`);

    if (!elements.length) {
        return null;
    }

    const node = elements[0];
    return node ? node as HTMLElement : null;
};