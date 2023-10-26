import { $PROGRESS_MENU_NAME } from "../../../../config/MenuConfig";
import type { MenuImpl } from "../../../../interface/MenuImpl";
import type { ProgressMenu } from "../../../domain/model/ProgressMenu";
import { $getMenu } from "../../MenuUtil";

/**
 * @description タスク進行管理の画面を非表示にする
 *              Hide the Task Progress Management screen.
 *
 * @params {string} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 進行状況メニューを非表示に
    const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
    if (!menu) {
        return ;
    }
    menu.hide();
};