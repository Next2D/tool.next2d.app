import { execute as userDatabaseInitializeSaveUseCase } from "@/user/application/Database/usecase/UserDatabaseInitializeSaveUseCase";
import { execute as historyUndoUseCase } from "@/history/usecase/HistoryUndoUseCase";
import { execute as historyRedoUseCase } from "@/history/usecase/HistoryRedoUseCase";
import {
    $generateShortcutKey,
    $setGlobalShortcut
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
    $setGlobalShortcut(
        $generateShortcutKey("s", { "ctrl": true }),
        userDatabaseInitializeSaveUseCase
    );

    $setGlobalShortcut(
        $generateShortcutKey("z", { "ctrl": true }),
        historyUndoUseCase
    );

    $setGlobalShortcut(
        $generateShortcutKey("z", { "ctrl": true, "shift": true  }),
        historyRedoUseCase
    );
};