import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

/**
 * @description 指定レイヤーIDと深度から要素を取得する
 *              Get the element from the specified layer ID and depth
 *
 * @param  {number} layer_id
 * @param  {number} depth
 * @return {HTMLElement | null}
 * @method
 * @public
 */
export const execute = (layer_id: number, depth: number): HTMLElement | null =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return null;
    }

    const elements = element
        .querySelectorAll(`.layer-id-${layer_id}`);

    if (!elements.length) {
        return null;
    }

    const node = elements[depth];
    return node ? node as HTMLElement : null;
};