import { BaseMenu } from "./BaseMenu";
import { $SCREEN_ALIGN_NAME } from "@/config/MenuConfig";

/**
 * @description 整列のメニュークラス
 *              Alignment menu class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ScreenAlignMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($SCREEN_ALIGN_NAME);
    }

    /**
     * @description メニュー位置を補正
     *              Correct menu position
     *
     * @return {HTMLElement}
     * @method
     * @public
     */
    move (element: HTMLElement): HTMLElement
    {
        element.style.left = `${this.offsetLeft}px`;
        element.style.top  = `${this.offsetTop}px`;
        return element;
    }
}