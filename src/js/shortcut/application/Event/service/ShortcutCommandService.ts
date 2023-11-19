import { $useShortcutSetting } from "@/menu/application/ShortcutSettingMenu/ShortcutSettingMenuUtil";
import {
    $generateShortcutKey,
    $getGlobalShortcut,
    $useKeyboard
} from "@/shortcut/ShortcutUtil";

/**
 * @description キーボードイベントの実行関数
 *              Execution function for keyboard events
 *
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
{
    // キーボードの入力中、もしくはショートカット設定中であれば終了
    if ($useKeyboard() || $useShortcutSetting()) {
        return ;
    }

    const useShiftKey: boolean = event.shiftKey;
    const useCtrlKey: boolean  = event.ctrlKey || event.metaKey; // command
    const useAltKey: boolean   = event.altKey;

    const code: string = $generateShortcutKey(event.key, {
        "alt": useAltKey,
        "shift": useShiftKey,
        "ctrl": useCtrlKey
    });

    // グローバルコマンドマップに登録されたショートカットをチェック
    const globalShortcut = $getGlobalShortcut();
    if (!globalShortcut.has(code)) {
        return ;
    }

    const callback: Function | undefined = globalShortcut.get(code);
    if (!callback) {
        return ;
    }

    // 全てのイベントを中止
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();

    // 登録されたコマンドを実行
    callback(event);
};