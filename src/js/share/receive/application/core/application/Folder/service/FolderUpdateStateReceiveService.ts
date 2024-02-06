import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Folder } from "@/core/domain/model/Folder";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const folder: InstanceImpl<Folder> = workSpace.getLibrary(libraryId);
    if (!folder) {
        return ;
    }

    const externalFolder = new ExternalFolder(workSpace, folder);
    if (message.data[2] === "open") {
        externalFolder.open(true);
    } else {
        externalFolder.close(true);
    }
};