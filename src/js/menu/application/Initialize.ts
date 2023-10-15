import type { MenuImpl } from "../../interface/MenuImpl";
import { UserSettingMenu } from "../domain/model/UserSettingMenu";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const menus: MenuImpl<any>[] = [
    UserSettingMenu
];

/**
 * @description 各種メニューモーダルの初期起動関数
 *              Initial startup functions for various menu modals
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // 起動
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < menus.length; ++idx) {
        const Menu: MenuImpl<any> = menus[idx];
        const menu = new Menu();
        if (!menu.initialize) {
            continue;
        }
        promises.push(menu.initialize());
    }

    await Promise.all(promises);
};