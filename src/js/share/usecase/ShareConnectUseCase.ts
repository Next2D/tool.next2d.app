import { $setSocket } from "../ShareUtil";
import { execute as shareConnectOpenEventService } from "../service/ShareConnectOpenEventService";
import { execute as shareMessageUseCase } from "./ShareMessageUseCase";
import { execute as shareGetSocketEndPointRepository } from "../domain/repository/ShareGetSocketEndPointRepository";

/**
 * @description 画面共有用のURLを発行してWebSocketを起動
 *              Issue a URL for screen sharing and start WebSocket
 *
 * @param  {string} room_id
 * @return {void}
 * @method
 * @public
 */
export const execute = async (room_id: string): Promise<void> =>
{
    const response = await shareGetSocketEndPointRepository(room_id);

    console.log(response.url);
    const webSocket: WebSocket = new WebSocket(response.url);

    // ソケットオブジェクトをセット
    $setSocket(webSocket);

    // イベントを登録
    webSocket.addEventListener("open", shareConnectOpenEventService);
    webSocket.addEventListener("message", shareMessageUseCase);
};