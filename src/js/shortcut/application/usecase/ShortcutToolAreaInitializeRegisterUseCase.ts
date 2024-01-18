import { execute as userDatabaseSaveUseCase } from "@/user/application/Database/usecase/UserDatabaseSaveUseCase";
import { execute as historyUndoUseCase } from "@/history/usecase/HistoryUndoUseCase";
import { execute as historyRedoUseCase } from "@/history/usecase/HistoryRedoUseCase";
import { execute as userSettingMenuShowService } from "@/menu/application/UserSettingMenu/service/UserSettingMenuShowService";
import {
    $generateShortcutKey,
    $setShortcut
} from "@/shortcut/ShortcutUtil";

/**
 * @description 画面全体で利用可能なコマンドを登録
 *              Register commands available throughout the screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // データ保存
    $setShortcut(
        $generateShortcutKey("s", { "ctrl": true }),
        userDatabaseSaveUseCase
    );

    // Undo
    $setShortcut(
        $generateShortcutKey("z", { "ctrl": true }),
        historyUndoUseCase
    );

    // Redo
    $setShortcut(
        $generateShortcutKey("z", { "ctrl": true, "shift": true  }),
        historyRedoUseCase
    );

    // ユーザー設定
    $setShortcut(
        $generateShortcutKey("u"),
        userSettingMenuShowService
    );
};