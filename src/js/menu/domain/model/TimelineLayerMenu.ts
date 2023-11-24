import { $TIMELINE_LAYER_MENU_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";

/**
 * @description レイヤーコントローラーのメニュークラス
 *              Layer Controller Menu Class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class TimelineLayerMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TIMELINE_LAYER_MENU_NAME);
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