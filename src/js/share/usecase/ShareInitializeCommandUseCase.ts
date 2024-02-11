import type { ShareInitializeSendObjectImpl } from "@/interface/ShareInitializeSendObjectImpl";
import { $getSocket } from "../ShareUtil";
import { execute as workSpaceCreateSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateSaveDataService";
import { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description オーナーのプロジェクトデーターを共有者に送信
 *              Send owner's project data to co-owner
 *
 * @param  {string} connection_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (connection_id: string): void =>
{
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    workSpaceCreateSaveDataService()
        .then((buffer: Uint8Array | null): void =>
        {
            if (!buffer) {
                return ;
            }

            let binary = "";
            for (let idx = 0; idx < buffer.length; idx += 4096) {
                binary += String.fromCharCode(...buffer.slice(idx, idx + 4096));
            }

            const initializeObject: ShareInitializeSendObjectImpl = {
                "workSpaceId": WorkSpace.workSpaceId,
                "connectionId": connection_id,
                "data": binary,
                "command": "load"
            };

            // オーナーのデータをレシバーに送信
            webSocket.send(JSON.stringify(initializeObject));
        });
};