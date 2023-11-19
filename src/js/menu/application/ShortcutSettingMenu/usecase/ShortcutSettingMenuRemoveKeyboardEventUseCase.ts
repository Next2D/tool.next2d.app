import { EventType } from "@/tool/domain/event/EventType";
import { execute as shortcutSettingMenuKeyboardEventUseCase } from "./ShortcutSettingMenuKeyboardEventUseCase";

/**
 * @description ショートカット登録用のキーボードイベントを解除
 *              Delete keyboard event for shortcut registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.removeEventListener(EventType.KEY_DOWN, shortcutSettingMenuKeyboardEventUseCase);
};