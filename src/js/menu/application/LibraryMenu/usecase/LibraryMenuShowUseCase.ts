import type { LibraryMenu } from "@/menu/domain/model/LibraryMenu";
import type { MenuImpl } from "@/interface/MenuImpl";
import { $LIBRARY_MENU_NAME } from "@/config/MenuConfig";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as libraryMenuCopyInactiveService } from "@/menu/application/LibraryMenu/service/LibraryMenuCopyInactiveService";
import { execute as libraryMenuCopyActiveService } from "@/menu/application/LibraryMenu/service/LibraryMenuCopyActiveService";
import { execute as libraryMenuExportActiveService } from "@/menu/application/LibraryMenu/service/LibraryMenuExportActiveService";
import { execute as libraryMenuExportInactiveService } from "@/menu/application/LibraryMenu/service/LibraryMenuExportInactiveService";
import {
    $allHideMenu,
    $getMenu
} from "../../MenuUtil";

/**
 * @description ライブラリ一覧エリアのメニューを表示
 *              Display the menu in the library list area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: MouseEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    $allHideMenu($LIBRARY_MENU_NAME);

    // 進行状況メニューを非表示に
    const menu: MenuImpl<LibraryMenu> | null = $getMenu($LIBRARY_MENU_NAME);
    if (!menu) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($LIBRARY_MENU_NAME);

    if (!element) {
        return ;
    }

    const clientWidth: number  = element.clientWidth;
    const clientHeight: number = element.clientHeight;

    // 上部にはみ出さない
    const height: number = clientHeight / 2;
    let top: number = event.pageY - height;
    if (0 > top) {
        top = 15;
    }

    if (event.pageY + height > window.innerHeight) {
        top = window.innerHeight - clientHeight - 15;
    }

    // 右端にはみ出さない
    let left = event.pageX + 15;
    if (left + clientWidth > window.innerWidth) {
        left = event.pageX - clientWidth - 15;
    }

    menu.offsetLeft = left;
    menu.offsetTop  = top;

    if (libraryArea.selectedIds.length) {

        // 選択中のアイテムが1個の場合
        if (libraryArea.selectedIds.length === 1) {
            // 書き出しボタンをアクティブに更新
            libraryMenuExportActiveService();
        } else {
            // 書き出しボタンを非アクティブに更新
            libraryMenuExportInactiveService();
        }

        // コピーボタンをアクティブに更新
        libraryMenuCopyActiveService();

    } else {

        // コピーボタンを非アクティブに更新
        libraryMenuCopyInactiveService();

        // 書き出しボタンを非アクティブに更新
        libraryMenuExportInactiveService();
    }

    menu.show();
};