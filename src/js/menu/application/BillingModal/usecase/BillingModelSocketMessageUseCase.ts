import { execute as billingModelHideService } from "../service/BillingModelHideService";
import { execute as adAreaHideService } from "@/controller/application/AdArea/service/AdAreaHideService";
import { execute as userDataBillingSaveUseCase } from "@/user/application/Billing/usecase/UserDataBillingSaveUseCase";

/**
 * @description アプリからのメッセージを受け取る
 *              Receive messages from the app
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // 現在の有効期限に加算して保存
    await userDataBillingSaveUseCase();

    // 広告枠を非表示にする
    adAreaHideService();

    // メニューを非表示にする
    billingModelHideService();
};