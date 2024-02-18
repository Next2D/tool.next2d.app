import type { MenuImpl } from "@/interface/MenuImpl";
import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { execute as confirmModalFileResetService } from "../service/ConfirmModalFileResetService";

/**
 * @description 全ての重複アイテムを上書きする
 *              Overwrite all duplicate items
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

    // 内部情報を初期化
    confirmModalFileResetService();

    // モーダルを終了する
    menu.hide();
};