import { $SCREEN_MENU_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import type { MenuImpl } from "@/interface/MenuImpl";

/**
 * @description スクリーンエリアのサブメニューを全て非表示にする
 *              Hide all submenus in the screen area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const parent: HTMLElement | null = document
        .getElementById($SCREEN_MENU_NAME);

    if (!parent) {
        return ;
    }

    const targetElement = event.target as HTMLElement;

    const showElementIds = [
        "screen-order",
        "screen-align"
    ];

    for (let idx: number = 0; idx < showElementIds.length; ++idx) {

        const elementId = showElementIds[idx];

        const menu: MenuImpl<any> | null = $getMenu(`${elementId}-menu`);
        if (!menu) {
            continue;
        }

        if (elementId === targetElement.id) {
            menu.offsetLeft = parent.offsetLeft + parent.clientWidth - 5;
            menu.offsetTop  = parent.offsetTop  + 20;
            menu.show();
        } else {
            menu.hide();
        }
    }
};