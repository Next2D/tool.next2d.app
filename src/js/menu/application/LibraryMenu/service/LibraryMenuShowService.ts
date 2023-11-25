import { $LIBRARY_MENU_NAME } from "@/config/MenuConfig";
import { $allHideMenu, $getMenu } from "../../MenuUtil";
import type { LibraryMenu } from "@/menu/domain/model/LibraryMenu";
import type { MenuImpl } from "@/interface/MenuImpl";

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

    const height: number = clientHeight / 2;
    let top: number = event.pageY - height;
    if (0 > top) {
        top = 15;
    }

    if (event.pageY + height > window.innerHeight) {
        top = window.innerHeight - clientHeight - 15;
    }

    let left = event.pageX + 15;
    if (left + clientWidth > window.innerWidth) {
        left = event.pageX - clientWidth - 15;
    }

    menu.offsetLeft = left;
    menu.offsetTop  = top;

    menu.show();
};