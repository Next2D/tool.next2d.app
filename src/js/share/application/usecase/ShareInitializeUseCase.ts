import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as shareConnectUseCase } from "./ShareConnectUseCase";

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
        return ;
    }

    const roomId: string = location.hash;
    if (!roomId) {
        return ;
    }

    shareConnectUseCase(roomId.replace("#", ""));
};