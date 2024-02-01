import { execute as userDatabaseSaveUseCase } from "@/user/application/Database/usecase/UserDatabaseSaveUseCase";
import { execute as historyUndoUseCase } from "@/controller/application/HistoryArea/usecase/HistoryUndoUseCase";
import { execute as historyRedoUseCase } from "@/controller/application/HistoryArea/usecase/HistoryRedoUseCase";
import { execute as userSettingMenuShowService } from "@/menu/application/UserSettingMenu/service/UserSettingMenuShowService";
import {
    $generateShortcutKey,
    $setShortcut
} from "@/shortcut/ShortcutUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
        $generateShortcutKey("z", { "ctrl": true }), (): void =>
        {
            const workSpace = $getCurrentWorkSpace();
            const scene = workSpace.scene;
            historyUndoUseCase(workSpace.id, scene.id);
        }
    );

    // Redo
    $setShortcut(
        $generateShortcutKey("z", { "ctrl": true, "shift": true  }), (): void =>
        {
            const workSpace = $getCurrentWorkSpace();
            const scene = workSpace.scene;
            historyRedoUseCase(workSpace.id, scene.id);
        }
    );

    // ユーザー設定
    $setShortcut(
        $generateShortcutKey("u"),
        userSettingMenuShowService
    );
};