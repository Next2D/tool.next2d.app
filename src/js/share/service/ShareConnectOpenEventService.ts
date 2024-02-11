import {
    $getSocket,
    $isSocketOwner
} from "../ShareUtil";

/**
 * @description WebSocketの接続成功時のユースケース
 *              Use cases for successful WebSocket connections
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // オーナーならここで終了
    if ($isSocketOwner()) {
        return ;
    }

    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    // 招待されてれば、元データをリクエスト
    webSocket.send(JSON.stringify({
        "roomId": location.hash.replace("#", ""),
        "command": "initialize"
    }));
};