import { $getSocket, $setSocket } from "@/share/application/ShareUtil";

/**
 * @description WebSocketを閉じて、オブジェクトを初期化
 *              Close WebSocket and initialize object
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const socket = $getSocket();
    if (!socket) {
        return ;
    }

    // socketを閉じる
    socket.close();

    // WebSocketのオブジェクトを初期化
    $setSocket(null);
};