import { $getCommandMapping, $useShortcutSetting } from "@/menu/application/ShortcutSettingMenu/ShortcutSettingMenuUtil";
import {
    $generateShortcutKey,
    $getShortcut,
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

    if (useCtrlKey) {

        // ブラウザの拡大縮小を無効化
        switch (event.key) {

            case "-":
            case "+":
            case ";":
                // 全てのイベントを中止
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
                break;

            default:
                break;

        }
    }

    const code: string = $generateShortcutKey(event.key, {
        "alt": useAltKey,
        "shift": useShiftKey,
        "ctrl": useCtrlKey
    });

    $getCommandMapping();

    // グローバルコマンドマップに登録されたショートカットをチェック
    const globalShortcut = $getShortcut();
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