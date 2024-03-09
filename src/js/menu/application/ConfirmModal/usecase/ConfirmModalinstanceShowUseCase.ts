import type { MenuImpl } from "@/interface/MenuImpl";
import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";

/**
 * @description Drop時に重複したアイテムがあれば確認モーダルを起動
 *              If there are duplicate items when dropping, a confirmation modal is triggered.
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

    // 重複があればモーダルを表示
    if (menu.instanceObjects.length > 0) {
        menu.setupInstanceObject();
    }
};