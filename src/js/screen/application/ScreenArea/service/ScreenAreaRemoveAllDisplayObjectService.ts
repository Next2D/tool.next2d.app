import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";

/**
 * @description スクリーンエリアのDisplayObjectを全て削除
 *              Remove all DisplayObjects in the screen area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const elements = element.querySelectorAll(".display-object");
    for (let idx = 0; idx < elements.length; idx++) {
        elements[idx].remove();
    }
};