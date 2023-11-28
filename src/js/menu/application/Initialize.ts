import type { MenuImpl } from "@/interface/MenuImpl";
import { ProgressMenu } from "../domain/model/ProgressMenu";
import { UserSettingMenu } from "../domain/model/UserSettingMenu";
import { ShortcutSettingMenu } from "../domain/model/ShortcutSettingMenu";
import { DetailModal } from "../domain/model/DetailModal";
import { ScreenTabMenu } from "../domain/model/ScreenTabMenu";
import { ScreenMenu } from "../domain/model/ScreenMenu";
import { ScreenOrderMenu } from "../domain/model/ScreenOrderMenu";
import { ScreenAlignMenu } from "../domain/model/ScreenAlignMenu";
import { TimelineMenu } from "../domain/model/TimelineMenu";
import { TimelineHeaderMenu } from "../domain/model/TimelineHeaderMenu";
import { TimelineLayerControllerMenu } from "../domain/model/TimelineLayerControllerMenu";
import { LibraryMenu } from "../domain/model/LibraryMenu";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const menus: MenuImpl<any>[] = [
    DetailModal,
    ProgressMenu,
    UserSettingMenu,
    ShortcutSettingMenu,
    ScreenTabMenu,
    ScreenMenu,
    ScreenOrderMenu,
    ScreenAlignMenu,
    TimelineMenu,
    TimelineHeaderMenu,
    TimelineLayerControllerMenu,
    LibraryMenu
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