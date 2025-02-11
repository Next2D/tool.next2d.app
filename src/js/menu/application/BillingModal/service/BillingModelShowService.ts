import type { BillingModal } from "@/menu/domain/model/BillingModal";
import { $BILLING_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";

/**
 * @description モーダル表示の処理関数
 *              Processing functions for modal display
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // メニューを非表示にする
    const menu = $getMenu<BillingModal>($BILLING_MODAL_NAME);
    if (!menu) {
        return ;
    }

    menu.show();
};