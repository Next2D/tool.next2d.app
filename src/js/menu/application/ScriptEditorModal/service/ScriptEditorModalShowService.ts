import type { MenuImpl } from "@/interface/MenuImpl";
import type { ScriptEditorModal } from "@/menu/domain/model/ScriptEditorModal";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";
import { $SCRIPT_EDITOR_MODAL_NAME } from "@/config/MenuConfig";

/**
 * @description ショートカットメニューを表示
 *              Show shortcut menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu: MenuImpl<ScriptEditorModal> | null = $getMenu($SCRIPT_EDITOR_MODAL_NAME);
    if (!menu) {
        return ;
    }

    $allHideMenu($SCRIPT_EDITOR_MODAL_NAME);

    menu.show();
};