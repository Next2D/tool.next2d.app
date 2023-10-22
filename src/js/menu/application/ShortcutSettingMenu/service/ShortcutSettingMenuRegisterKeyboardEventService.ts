import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as shortcutSettingMenuKeyboardEventUseCase } from "../usecase/ShortcutSettingMenuKeyboardEventUseCase";

/**
 * @description ショートカット登録用のキーボードイベントを登録
 *              Register keyboard events for shortcut registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.KEY_DOWN, shortcutSettingMenuKeyboardEventUseCase);
};