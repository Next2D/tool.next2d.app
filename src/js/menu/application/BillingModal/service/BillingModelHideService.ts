import type { BillingModal } from "@/menu/domain/model/BillingModal";
import { $BILLING_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";

/**
 * @description モーダル終了の処理関数
 *              Processing function for modal termination
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // メニューを非表示にする
    const menu = $getMenu<BillingModal>($BILLING_MODAL_NAME);
    if (!menu) {
        return ;
    }

    menu.hide();
};