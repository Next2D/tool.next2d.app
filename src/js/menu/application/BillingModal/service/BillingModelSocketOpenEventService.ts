import { $getSocket } from "@/share/application/ShareUtil";

/**
 * @description リワード受け入れようのSocketにログイン
 *              Login to Socket to accept rewards
 *
 * @param  {string} user_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (user_id: string): void =>
{
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    // ユーザー登録
    webSocket.send(JSON.stringify({ "auth": user_id, "passwd": user_id }));
};