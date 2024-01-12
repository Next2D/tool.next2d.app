import { execute as billingModelSocketConnectUseCase } from "./BillingModelSocketConnectUseCase";
import { execute as billingModelGenerateQRCodeService } from "../service/BillingModelGenerateQRCodeService";

/**
 * @description モーダル起動の処理関数
 *              Processing function for modal startup
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    const roomId = crypto.randomUUID();
    const userId = crypto.randomUUID();

    // WebSocketを起動
    billingModelSocketConnectUseCase(roomId, userId);

    // QRコードを生成
    return billingModelGenerateQRCodeService(roomId, userId);
};