import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import type { IMenu } from "@/interface/IMenu";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";

/**
 * @description File配列を初期化
 *              Initialize File array
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const menu: IMenu<ConfirmModal> | null = $getMenu($CONFIRM_MODAL_NAME);
    if (!menu) {
        return ;
    }

    // file reset
    menu.instanceObject = null;
    menu.instanceObjects.length = 0;
};