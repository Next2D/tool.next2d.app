import { $getSocket } from "../ShareUtil";
import { execute as workSpaceCreateSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateSaveDataService";

/**
 * @description オーナーのプロジェクトデーターを共有者に送信
 *              Send owner's project data to co-owner
 *
 * @param  {string} send_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (send_id: string): void =>
{
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    workSpaceCreateSaveDataService()
        .then((binary): void =>
        {
            // オーナーのデータをレシバーに送信
            webSocket.send(JSON.stringify({
                "to": send_id,
                "data": binary,
                "command": "load"
            }));
        });
};