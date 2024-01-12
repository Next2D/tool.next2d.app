import { execute as billingModelHideService } from "../service/BillingModelHideService";

/**
 * @description スクリプトエディタの閉じるボタン実行処理関数
 *              Script Editor Close Button Execution Processing Function
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示にする
    billingModelHideService();
};