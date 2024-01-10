import { $setSocket } from "../ShareUtil";
import { execute as shareConnectOpenEventUseCase } from "./ShareConnectOpenEventUseCase";
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
    webSocket.addEventListener("open", shareConnectOpenEventUseCase);
    webSocket.addEventListener("message", shareMessageUseCase);
};