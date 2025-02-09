import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { IHistoryObject } from "@/interface/IHistoryObject";
import {
    $getMessage,
    $getMessages,
    $getSocket,
    $pushMessage
} from "../ShareUtil";

/**
 * @description 作業履歴を共有者に送信
 *              Send work history to sharers
 *
 * @param  {object} history_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (history_object: IHistoryObject): void =>
{
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    // 共有しているメンバー全員に送信
    const sendObject: IShareReceiveMessage = {
        "roomId": location.hash.replace("#", ""),
        "historyCommand": history_object.command,
        "data": history_object.messages,
        "command": "receive"
    };

    // メッセージがプールされていれる場合は最後に追加して終了
    if ($getMessages().length > 0) {
        return $pushMessage(sendObject);
    }

    // 複数送信を待機して実行
    $pushMessage(sendObject);
    setTimeout(async (): Promise<void> =>
    {
        while (true) {

            const sendObject = $getMessage();
            if (!sendObject) {
                break;
            }

            await new Promise((resolve): void =>
            {
                webSocket.send(JSON.stringify(sendObject));
                setTimeout(resolve, 200);
            });
        }
    }, 200);
};