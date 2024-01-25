import {
    $getSocket,
    $getUserName,
    $isSocketOwner,
    $setUserName
} from "../application/ShareUtil";

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
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    // ユーザー登録
    const uuid = $isSocketOwner() ? $getUserName() : crypto.randomUUID();
    $setUserName(uuid);
    webSocket.send(JSON.stringify({ "auth": uuid, "passwd": uuid }));

    // ルームに招待
    const roomId: string = location.hash.replace("#", "");
    webSocket.send(JSON.stringify({ "joinHub": roomId }));

    // オーナーならここで終了
    if ($isSocketOwner()) {
        return ;
    }

    // 招待されてれば、元データをリクエスト
    webSocket.send(JSON.stringify({ "toH": roomId, "command": "initialize" }));
};