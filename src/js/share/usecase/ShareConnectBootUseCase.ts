import { $setSocketOwner, $setUserName, $useSocket } from "../application/ShareUtil";
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
    // 画面共有中なら終了
    if ($useSocket()) {
        return ;
    }

    // 機能制限があれば終了
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