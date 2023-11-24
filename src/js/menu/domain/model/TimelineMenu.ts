import { $TIMELINE_MENU_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";

/**
 * @description レイヤーのメニュークラス
 *              Layer menu class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class TimelineMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TIMELINE_MENU_NAME);
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