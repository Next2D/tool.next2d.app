import { $SCREEN_SCALE_ID } from "@/config/ToolConfig";

/**
 * @description スクリーンの拡大縮小値のElementの更新関数
 *              Update function of the screen magnification value Element
 *
 * @param  {number} scale
 * @return {void}
 * @method
 * @public
 */
export const execute = (scale: number): void =>
{
    const element = document
        .getElementById($SCREEN_SCALE_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = `${scale}`;
};