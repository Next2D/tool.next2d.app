import type { IMenu } from "@/interface/IMenu";
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
    const menu: IMenu<ConfirmModal> = $getMenu($CONFIRM_MODAL_NAME);
    if (!menu) {
        return ;
    }

    switch (true) {

        // Fileの単体キャンセル
        case menu.fileObject !== null:
            // 次のFileに移動
            menu.setupFileObject();
            break;

        default:
            break;
    }
};