import type { MenuImpl } from "../../interface/MenuImpl";

const $menus: Map<string, MenuImpl<any>> = new Map();

/**
 * @description メニューオブジェクトをマップに登録
 *              Register menu object to map
 *
 * @param  {object} menu
 * @return {void}
 * @method
 * @public
 */
export const $registerMenu = (menu: MenuImpl<any>): void =>
{
    $menus.set(menu.name, menu);
};

/**
 * @description メニューオブジェクトを名前を指定して取得
 *              Obtain a menu object by name
 *
 * @param  {string} name
 * @return {object}
 * @method
 * @public
 */
export const $getMenu = (name: string): MenuImpl<any> | null =>
{
    return $menus.has(name)
        ? $menus.get(name)
        : null;
};

/**
 * @description 全てのメニューオブジェクトを取得
 *              Get all menu objects
 *
 * @return {object}
 * @method
 * @public
 */
export const $getMenuAll = (): Map<string, MenuImpl<any>> =>
{
    return $menus;
};