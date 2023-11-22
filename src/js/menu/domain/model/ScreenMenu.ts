import { $SCREEN_MENU_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as screenMenuInitializeRegisterEventUseCase } from "@/menu/application/ScreenMenu/usecase/ScreenMenuInitializeRegisterEventUseCase";

/**
 * @description スクリーンエリアのメニュークラス
 *              Screen area menu class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ScreenMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($SCREEN_MENU_NAME);
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
        screenMenuInitializeRegisterEventUseCase();
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