import type { BaseMenu } from "@/menu/domain/model/BaseMenu";

/**
 * @type {Map<string, BaseMenu>}
 * @private
 */
const $menus: Map<string, BaseMenu> = new Map();

/**
 * @description メニューオブジェクトをマップに登録
 *              Register menu object to map
 *
 * @param  {C} menu
 * @return {void}
 * @method
 * @public
 */
export const $registerMenu = <C extends BaseMenu> (menu: C): void =>
{
    $menus.set(menu.name, menu);
};

/**
 * @description メニューオブジェクトを名前を指定して取得
 *              Obtain a menu object by name
 *
 * @param  {string} name
 * @return {C | null}
 * @method
 * @public
 */
export const $getMenu = <C extends BaseMenu> (name: string): C | null =>
{
    return $menus.has(name)
        ? $menus.get(name) as C
        : null;
};

/**
 * @description 指定されたメニュー以外の全てのウィンドウを閉じる
 *              Close all windows except the specified menu
 *
 * @param  {string} [ignore = ""]
 * @return {void}
 * @method
 * @public
 */
export const $allHideMenu = (ignore: string = ""): void =>
{
    for (const menu of $menus.values()) {
        if (menu.name === ignore) {
            continue;
        }
        menu.hide();
    }
};