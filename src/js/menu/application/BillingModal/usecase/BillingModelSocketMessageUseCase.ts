import { execute as billingModelHideService } from "../service/BillingModelHideService";

/**
 * @description アプリからのメッセージを受け取る
 *              Receive messages from the app
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: MessageEvent): void =>
{
    const message = JSON.parse(event.data);
    console.log("message: ", message);

    // 更新処理
    if (message.command === "reward") {

        // メニューを非表示にする
        billingModelHideService();

        // TODO 報酬受け取り処理
        console.log("reward: ", message);
    }
};