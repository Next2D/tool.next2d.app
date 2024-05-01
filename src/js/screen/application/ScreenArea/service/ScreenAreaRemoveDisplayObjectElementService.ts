import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

/**
 * @description 指定したDisplayObjectのElementをStageAreaから削除
 *              Remove the Element of the specified DisplayObject from the StageArea
 *
 * @param  {number} layer_id
 * @param  {number} depth
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, depth: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const elements = element.querySelectorAll(`.layer-id-${layer_id}`);
    const displayElement = elements[depth];
    if (!displayElement) {
        return ;
    }

    // elementを削除
    displayElement.remove();
};