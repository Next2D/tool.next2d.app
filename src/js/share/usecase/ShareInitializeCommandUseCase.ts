import type { IShareInitializeSendObject } from "@/interface/IShareInitializeSendObject";
import { $getSocket } from "../ShareUtil";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as workSpaceCreateSaveDataUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceCreateSaveDataUseCase";
import { execute as shareGetS3EndPointRepository } from "../domain/repository/ShareGetS3EndPointRepository";
import { execute as sharePutS3FileRepository } from "../domain/repository/SharePutS3FileRepository";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";
import { $generateUUID } from "@/global/GlobalUtil";

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

    const buffer: Uint8Array | null = await workSpaceCreateSaveDataUseCase();
    if (!buffer) {
        return ;
    }

    // S3にファイルをアップロード
    const fileId = $generateUUID();
    const url = await shareGetS3EndPointRepository(fileId, "put");

    const binary = bufferToBinaryService(buffer);
    await sharePutS3FileRepository(url, binary);

    const initializeObject: IShareInitializeSendObject = {
        "workSpaceId": WorkSpace.workSpaceId,
        "connectionId": connection_id,
        "fileId": fileId,
        "command": "load"
    };

    // オーナーのデータをレシバーに送信
    webSocket.send(JSON.stringify(initializeObject));
};