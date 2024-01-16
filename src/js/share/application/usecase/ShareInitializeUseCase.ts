import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as shareConnectUseCase } from "./ShareConnectUseCase";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";

/**
 * @description WebSocketの初期起動時のユースケース
 *              Use cases for initial WebSocket startup
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 全ての機能が利用可能でなければ中止
    if (!userAllFunctionStateService()) {
        billingModelShowService();
        return ;
    }

    const roomId: string = location.hash;
    if (!roomId) {
        return ;
    }

    shareConnectUseCase(roomId.replace("#", ""));
};