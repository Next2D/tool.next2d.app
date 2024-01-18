import { $setSocket } from "@/share/application/ShareUtil";
import {
    $API_KEY,
    $REWORD_URL
} from "@/config/BillingConfig";
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
export const execute = (room_id: string): void =>
{
    const webSocket: WebSocket = new WebSocket(
        `${$REWORD_URL}/${room_id}?api_key=${$API_KEY}`
    );

    // ソケットオブジェクトをセット
    $setSocket(webSocket);

    // イベントを登録
    webSocket.addEventListener("message",
        billingModelSocketMessageUseCase
    );
};