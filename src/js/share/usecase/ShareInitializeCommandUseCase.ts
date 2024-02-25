import type { ShareInitializeSendObjectImpl } from "@/interface/ShareInitializeSendObjectImpl";
import { $getSocket } from "../ShareUtil";
import { execute as workSpaceCreateSaveDataService } from "@/core/application/WorkSpace/service/WorkSpaceCreateSaveDataService";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as shareGetS3EndPointRepository } from "../domain/repository/ShareGetS3EndPointRepository";
import { execute as sharePutS3FileRepository } from "../domain/repository/SharePutS3FileRepository";

/**
 * @description オーナーのプロジェクトデーターを共有者に送信
 *              Send owner's project data to co-owner
 *
 * @param  {string} connection_id
 * @return {void}
 * @method
 * @public
 */
export const execute = async (connection_id: string): Promise<void> =>
{
    const webSocket = $getSocket();
    if (!webSocket) {
        return ;
    }

    const buffer: Uint8Array | null = await workSpaceCreateSaveDataService();
    if (!buffer) {
        return ;
    }

    let binary = "";
    for (let idx = 0; idx < buffer.length; idx += 4096) {
        binary += String.fromCharCode(...buffer.slice(idx, idx + 4096));
    }

    // S3にファイルをアップロード
    const fileId = window.crypto.randomUUID();
    const url = await shareGetS3EndPointRepository(fileId, "put");
    await sharePutS3FileRepository(url, binary);

    const initializeObject: ShareInitializeSendObjectImpl = {
        "workSpaceId": WorkSpace.workSpaceId,
        "connectionId": connection_id,
        "fileId": fileId,
        "data": binary,
        "command": "load"
    };

    // オーナーのデータをレシバーに送信
    webSocket.send(JSON.stringify(initializeObject));
};