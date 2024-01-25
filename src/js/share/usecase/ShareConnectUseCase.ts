import { $setSocket } from "../application/ShareUtil";
import { execute as shareConnectOpenEventService } from "../service/ShareConnectOpenEventService";
import { execute as shareMessageUseCase } from "./ShareMessageUseCase";
import {
    $SHARE_PREFIX,
    $SHARE_URL
} from "@/config/ShareConfig";

/**
 * @description 画面共有用のURLを発行してWebSocketを起動
 *              Issue a URL for screen sharing and start WebSocket
 *
 * @param  {string} room_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (room_id: string): void =>
{
    const webSocket: WebSocket = new WebSocket(
        `${$SHARE_URL}/${$SHARE_PREFIX}-${room_id}`
    );

    // ソケットオブジェクトをセット
    $setSocket(webSocket);

    // イベントを登録
    webSocket.addEventListener("open", shareConnectOpenEventService);
    webSocket.addEventListener("message", shareMessageUseCase);
};