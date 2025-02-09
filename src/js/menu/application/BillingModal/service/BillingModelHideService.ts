import { $BILLING_MODAL_NAME } from "@/config/MenuConfig";
import type { IMenu } from "@/interface/IMenu";
import type { BillingModal } from "@/menu/domain/model/BillingModal";
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
    const menu: IMenu<BillingModal> | null = $getMenu($BILLING_MODAL_NAME);
    if (!menu) {
        return ;
    }

    menu.hide();
};