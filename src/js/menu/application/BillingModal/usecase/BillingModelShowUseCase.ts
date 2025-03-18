import { execute as billingModelSocketConnectUseCase } from "./BillingModelSocketConnectUseCase";
import { execute as billingModelGenerateQRCodeService } from "../service/BillingModelGenerateQRCodeService";
import { $generateUUID } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";

/**
 * @description モーダル起動の処理関数
 *              Processing function for modal startup
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    const roomId = $generateUUID();

    // WebSocketを起動
    billingModelSocketConnectUseCase(roomId);

    // QRコードを生成
    return billingModelGenerateQRCodeService(roomId);
};