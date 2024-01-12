import { $setSocket } from "@/share/application/ShareUtil";
import {
    $SHARE_PREFIX,
    $SHARE_URL
} from "@/config/ShareConfig";
import { execute as billingModelSocketOpenEventService } from "../service/BillingModelSocketOpenEventService";
import { execute as billingModelSocketMessageUseCase } from "./BillingModelSocketMessageUseCase";

/**
 * @description リワード受け入れようのWebSocketを起動
 *              Launch WebSocket to accept rewards
 *
 * @param  {string} room_id
 * @param  {string} user_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (room_id: string, user_id: string): void =>
{
    const webSocket: WebSocket = new WebSocket(
        `${$SHARE_URL}/${$SHARE_PREFIX}-${room_id}`
    );

    // ソケットオブジェクトをセット
    $setSocket(webSocket);

    // イベントを登録
    webSocket.addEventListener("open", (): void =>
    {
        billingModelSocketOpenEventService(user_id);
    });
    webSocket.addEventListener("message", billingModelSocketMessageUseCase);
};