import type { MenuImpl } from "@/interface/MenuImpl";
import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";

/**
 * @description 単体のアイテム重複をキャンセルする
 *              Cancel single item duplication
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu: MenuImpl<ConfirmModal> = $getMenu($CONFIRM_MODAL_NAME);
    if (!menu) {
        return ;
    }

    switch (true) {

        // Fileを全て上書く
        case menu.fileObjects.length > 0:
            // 一個のFile重複をキャンセルする
            menu.fileObjects.pop();

            // 配列が空ならモーダルを終了
            if (!menu.fileObjects.length) {
                menu.hide();
            }
            break;

        default:
            break;
    }
};