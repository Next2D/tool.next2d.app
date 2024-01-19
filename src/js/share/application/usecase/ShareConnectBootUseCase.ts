import { $setSocketOwner, $setUserName } from "../ShareUtil";
import { execute as shareConnectUseCase } from "./ShareConnectUseCase";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";

/**
 * @description WebSocketの機能を起動
 *              Activate WebSocket functionality
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    if (!userAllFunctionStateService()) {
        billingModelShowService();
        return ;
    }

    // ユニークなIDを発番
    const roomId = crypto.randomUUID();

    // URLを更新
    history.pushState("", "",
        `${location.origin}/#${roomId}`
    );

    // オーナーとして登録
    $setSocketOwner(true);

    // オーナーIDをセット
    $setUserName(roomId);

    // WebSocketを起動
    shareConnectUseCase(roomId);
};