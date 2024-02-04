import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { Instance } from "@/core/domain/model/Instance";

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

    const instance = new Instance({
        "id": message.data[1] as NonNullable<number>,
        "name": message.data[2] as NonNullable<string>,
        "folderId": message.data[3] as NonNullable<number>,
        "type": "folder"
    });

    const externalLibrary = new ExternalLibrary(workSpace);
    externalLibrary.addNewFolder(
        instance.getPath(workSpace), true
    );
};