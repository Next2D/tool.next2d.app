import type { ShareInitializeSendObjectImpl } from "@/interface/ShareInitializeSendObjectImpl";
import { $getSocket } from "../ShareUtil";
import { execute as workSpaceCreateSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateSaveDataService";
import { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description オーナーのプロジェクトデーターを共有者に送信
 *              Send owner's project data to co-owner
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

    workSpaceCreateSaveDataService()
        .then((binary): void =>
        {
            const initializeObject: ShareInitializeSendObjectImpl = {
                "workSpaceId": WorkSpace.workSpaceId,
                "data": binary,
                "command": "load"
            };

            // オーナーのデータをレシバーに送信
            webSocket.send(JSON.stringify(initializeObject));
        });
};