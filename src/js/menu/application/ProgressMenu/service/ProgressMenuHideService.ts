import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import type { IMenu } from "@/interface/IMenu";
import type { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { $getMenu } from "@/menu/application/MenuUtil";

/**
 * @description タスク進行管理の画面を非表示にする
 *              Hide the Task Progress Management screen.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 進行状況メニューを非表示に
    const menu: IMenu<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
    if (!menu) {
        return ;
    }
    menu.hide();
};