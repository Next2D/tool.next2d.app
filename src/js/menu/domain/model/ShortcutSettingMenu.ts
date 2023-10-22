import { $SHORTCUT_MENU_NAME } from "../../../config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as shortcutSettingMenuInitializeUseCase } from "../../application/ShortcutSettingMenu/usecase/ShortcutSettingMenuInitializeUseCase";
import { execute as shortcutSettingShowUseCase } from "../../application/ShortcutSettingMenu/usecase/ShortcutSettingShowUseCase";
import { execute as shortcutSettingHideUseCase } from "../../application/ShortcutSettingMenu/usecase/ShortcutSettingHideUseCase";

/**
 * @description ショートカット設定メニュークラス
 *              User shortcut menu class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ShortcutSettingMenu extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($SHORTCUT_MENU_NAME);
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
     * @description メニューを表示
     *              Show menu
     *
     * @return {void}
     * @method
     * @public
     */
    show (): void
    {
        super.show();

        // ショートカットの表示時のユースケース
        shortcutSettingShowUseCase();
    }

    /**
     * @description メニューを非表示
     *              Hide menu
     *
     * @return {void}
     * @method
     * @public
     */
    hide (): void
    {
        super.hide();

        // ショートカットの非表示時のユースケース
        shortcutSettingHideUseCase();
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
        shortcutSettingMenuInitializeUseCase();
    }
}