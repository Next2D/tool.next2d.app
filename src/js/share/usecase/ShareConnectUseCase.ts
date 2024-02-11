import { $setSocket } from "../ShareUtil";
import { execute as shareConnectOpenEventService } from "../service/ShareConnectOpenEventService";
import { execute as shareMessageUseCase } from "./ShareMessageUseCase";
// @ts-ignore
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

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
    console.log(import.meta.env);

    const webSocket: WebSocket = new WebSocket(
        `${SOCKET_URL}?roomId=${room_id}`
    );

    // ソケットオブジェクトをセット
    $setSocket(webSocket);

    // イベントを登録
    webSocket.addEventListener("open", shareConnectOpenEventService);
    webSocket.addEventListener("message", shareMessageUseCase);
};