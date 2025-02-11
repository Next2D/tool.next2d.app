import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $allHideMenu, $getMenu } from "@/menu/application/MenuUtil";

/**
 * @description タスク進行管理の画面を表示する
 *              Display the Task Progress Management screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 進行状況メニューを非表示に
    const menu = $getMenu<ProgressMenu>($PROGRESS_MENU_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($PROGRESS_MENU_NAME);

    menu.show();
};