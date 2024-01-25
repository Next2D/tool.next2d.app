import type { ShareInitializeSendObjectImpl } from "@/interface/ShareInitializeSendObjectImpl";
import { $getSocket } from "../application/ShareUtil";
import { execute as workSpaceCreateSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateSaveDataService";
import { WorkSpace } from "@/core/domain/model/WorkSpace";

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
            const initializeObject: ShareInitializeSendObjectImpl = {
                "to": send_id,
                "workSpaceId": WorkSpace.workSpaceId,
                "data": binary,
                "command": "load"
            };

            // オーナーのデータをレシバーに送信
            webSocket.send(JSON.stringify(initializeObject));
        });
};