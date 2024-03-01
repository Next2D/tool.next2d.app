import { MenuImpl } from "@/interface/MenuImpl";
import { SceneListMenu } from "@/menu/domain/model/SceneListMenu";
import { $getMenu } from "../../MenuUtil";
import { $SCENE_LIST_MENU_NAME } from "@/config/MenuConfig";

/**
 * @description シーン一覧メニューの画面を非表示にする
 *              Hide the scene list menu screen
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // シーン一覧メニュー
    const menu: MenuImpl<SceneListMenu> | null = $getMenu($SCENE_LIST_MENU_NAME);
    if (!menu) {
        return ;
    }

    menu.hide();
};