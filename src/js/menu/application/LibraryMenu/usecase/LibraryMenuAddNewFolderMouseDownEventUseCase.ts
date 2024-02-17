import { $allHideMenu } from "../../MenuUtil";
import { execute as libraryMenuAddNewFolderService } from "../service/LibraryMenuAddNewFolderService";

/**
 * @description ライブラリメニューのフォルダー追加ボタンの実行関数
 *              Execution function of the Add Folder button in the Library menu
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // メニューを非表示に更新
    $allHideMenu();

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // 新規フォルダー追加実行
    libraryMenuAddNewFolderService();
};