import { execute as userDatabaseInitializeSaveUseCase } from "@/user/application/Database/usecase/UserDatabaseInitializeSaveUseCase";
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
};