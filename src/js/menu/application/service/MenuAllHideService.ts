import type { MenuImpl } from "../../../interface/MenuImpl";
import { $getMenuAll } from "../Menu";

/**
 * @description 指定されたメニュー以外の全てのウィンドウを閉じる
 *              Close all windows except the specified menu
 *
 * @param  {string} [ignore = ""]
 * @return {void}
 * @method
 * @public
 */
export const execute = (ignore: string = ""): void =>
{
    const menus: Map<string, MenuImpl<any>> = $getMenuAll();
    for (const menu of menus.values()) {
        if (menu.name === ignore) {
            continue;
        }
        menu.hide();
    }
};
