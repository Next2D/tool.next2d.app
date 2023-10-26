import { $SCREEN_TAB_MENU_NAME } from "../../../config/MenuConfig";
import { BaseMenu } from "./BaseMenu";

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
        
    }
}