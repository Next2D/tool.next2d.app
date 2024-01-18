import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { $getSocket } from "../ShareUtil";

/**
 * @description 作業履歴を共有者に送信
 *              Send work history to sharers
 *
 * @param  {string} command
 * @return {void}
 * @method
 * @public
 */
export const execute = (command: string, args: any[]): void =>
{
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    // 共有者、全員に送信
    const roomId: string = location.hash.replace("#", "");

    const sendObject: ShareReceiveMessageImpl = {
        "toH": roomId,
        "historyCommand": command,
        "data": args,
        "command": "receive"
    };

    webSocket.send(JSON.stringify(sendObject));
};