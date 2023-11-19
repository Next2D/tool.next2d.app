import { $SCREEN_TAB_MENU_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as screenTabMenuInitializeUseCase } from "../../application/ScreenTabMenu/usecase/ScreenTabMenuInitializeUseCase";

/**
 * @description スクリーンのタブ一覧メニューの管理クラス
 *              Management class for the screen's tab list menu
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ScreenTabMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($SCREEN_TAB_MENU_NAME);
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
        screenTabMenuInitializeUseCase();
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