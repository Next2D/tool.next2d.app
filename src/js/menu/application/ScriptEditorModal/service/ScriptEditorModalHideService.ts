import type { ScriptEditorModal } from "@/menu/domain/model/ScriptEditorModal";
import { $SCRIPT_EDITOR_MODAL_NAME } from "@/config/MenuConfig";
import { $setEditingElement } from "@/global/GlobalUtil";
import {
    $allHideMenu,
    $getMenu
} from "@/menu/application/MenuUtil";

/**
 * @description ショートカットメニューを非表示
 *              Hide shortcut menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu = $getMenu<ScriptEditorModal>($SCRIPT_EDITOR_MODAL_NAME);
    if (!menu) {
        return ;
    }

    // 編集中のElementを初期化
    $setEditingElement(null);

    // メニューを非表示にする
    $allHideMenu($SCRIPT_EDITOR_MODAL_NAME);

    menu.hide();
};