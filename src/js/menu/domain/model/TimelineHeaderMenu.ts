import { $TIMELINE_HEADER_MENU_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as timelineHeaderMenuInitializeRegisterEventUseCase } from "@/menu/application/TimelineHeaderMenu/usecase/TimelineHeaderMenuInitializeRegisterEventUseCase";

/**
 * @description レイヤーヘッダーのメニュークラス
 *              Layer header menu class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class TimelineHeaderMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TIMELINE_HEADER_MENU_NAME);
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

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        timelineHeaderMenuInitializeRegisterEventUseCase();
    }
}