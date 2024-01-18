import { $BILLING_MODAL_NAME } from "@/config/MenuConfig";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { BillingModal } from "@/menu/domain/model/BillingModal";
import { $getMenu } from "../../MenuUtil";

/**
 * @description モーダル表示の処理関数
 *              Processing functions for modal display
 *
 * @return {void}
 * @method
 * @public
 */
export const    execute = (): void =>
{
    // メニューを非表示にする
    const menu: MenuImpl<BillingModal> | null = $getMenu($BILLING_MODAL_NAME);
    if (!menu) {
        return ;
    }

    menu.show();
};