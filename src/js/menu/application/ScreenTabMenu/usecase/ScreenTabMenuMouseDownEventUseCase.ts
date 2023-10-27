import { $SCREEN_TAB_MENU_NAME } from "../../../../config/MenuConfig";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { ScreenTabMenu } from "../../../domain/model/ScreenTabMenu";
import { $getMenu } from "../../MenuUtil";
import { execute as screenTabMenuShowService } from "../service/ScreenTabMenuShowService";
import { execute as screenTabMenuHideService } from "../service/ScreenTabMenuHideService";

/**
 * @description スクリーンタブの名前一覧のボタンのイベント処理関数
 *              Event handling functions for buttons in the screen tab name list
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu: MenuImpl<ScreenTabMenu> | null = $getMenu($SCREEN_TAB_MENU_NAME);
    if (!menu) {
        return ;
    }

    if (menu.state === "hide") {
        screenTabMenuShowService();
    } else {
        screenTabMenuHideService();
    }
};