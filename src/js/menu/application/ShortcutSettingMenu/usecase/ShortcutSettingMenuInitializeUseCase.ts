import { $SHORTCUT_SETTING_CLOSE_ID } from "../../../../config/ShortcutConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as shortcutSettingMenuCloseElementMouseDownUseCase } from "./ShortcutSettingMenuCloseElementMouseDownUseCase";

/**
 * @description ショートカットメニューの初期起動ユースケース
 *              Initial startup use case for shortcut menus
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const shortcutSettingClose: HTMLElement | null = document
        .getElementById($SHORTCUT_SETTING_CLOSE_ID);

    if (shortcutSettingClose) {
        shortcutSettingClose.addEventListener(EventType.MOUSE_DOWN, (): void =>
        {
            shortcutSettingMenuCloseElementMouseDownUseCase();
        });
    }
};