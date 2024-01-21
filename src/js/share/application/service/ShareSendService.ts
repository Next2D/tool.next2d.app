import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $getSocket } from "../ShareUtil";

/**
 * @description 作業履歴を共有者に送信
 *              Send work history to sharers
 *
 * @param  {object} history_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (history_object: HistoryObjectImpl): void =>
{
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    // 共有しているメンバー全員に送信
    const sendObject: ShareReceiveMessageImpl = {
        "toH": location.hash.replace("#", ""),
        "historyCommand": history_object.command,
        "data": history_object.args,
        "command": "receive"
    };

    webSocket.send(JSON.stringify(sendObject));
};