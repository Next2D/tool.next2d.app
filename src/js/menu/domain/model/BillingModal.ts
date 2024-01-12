import { $BILLING_MODAL_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as billingModelShowUseCase } from "@/menu/application/BillingModal/usecase/BillingModelShowUseCase";
import { execute as billingModelSocketCloseService } from "@/menu/application/BillingModal/service/BillingModelSocketCloseService";
import { execute as billingModelInitializeRegisterEventUseCase } from "@/menu/application/BillingModal/usecase/BillingModelInitializeRegisterEventUseCase";

/**
 * @description 機能制限解除案内のモーダル管理クラス
 *              Modal management class for function restriction release guidance
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class BillingModal extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($BILLING_MODAL_NAME);
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        // モーダルのイベント登録
        billingModelInitializeRegisterEventUseCase();
    }

    /**
     * @description 機能制限解除案内のモーダル開始関数
     *              Modal start function for function restriction release guidance
     *
     * @returns {void}
     * @method
     * @public
     */
    show (): void
    {
        if (this._$state === "show") {
            return ;
        }

        // ユースケースを実行
        billingModelShowUseCase()
            .then((): void =>
            {
                super.show();
            });
    }

    /**
     * @description 機能制限解除案内のモーダル終了関数
     *              Modal termination function for function restriction release guidance
     *
     * @returns {void}
     * @method
     * @public
     */
    hide (): void
    {
        if (this._$state === "hide") {
            return ;
        }

        super.hide();

        // Socketを終了する
        billingModelSocketCloseService();
    }
}