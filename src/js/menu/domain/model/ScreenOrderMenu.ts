import { $SCREEN_ORDER_MENU_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";

/**
 * @description 重ね順のメニュークラス
 *              Menu classes in stacking order
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ScreenOrderMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($SCREEN_ORDER_MENU_NAME);
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