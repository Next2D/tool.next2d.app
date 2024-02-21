import { execute as libraryMenuAddNewFolderService } from "@/menu/application/LibraryMenu/service/LibraryMenuAddNewFolderService";
import { execute as libraryMenuOpenFileLoadingModalService } from "@/menu/application/LibraryMenu/service/LibraryMenuOpenFileLoadingModalService";
import {
    $generateShortcutKey,
    $setShortcut
} from "@/shortcut/ShortcutUtil";

/**
 * @description ライブラリエリアのショートカットイベントを登録
 *              Register shortcut events in the library area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 新規フォルダー追加
    $setShortcut(
        $generateShortcutKey("f", { "ctrl": true, "shift": true }),
        libraryMenuAddNewFolderService
    );

    // 外部ファイル読込画面を起動
    $setShortcut(
        $generateShortcutKey("r", { "ctrl": true }),
        libraryMenuOpenFileLoadingModalService
    );
};