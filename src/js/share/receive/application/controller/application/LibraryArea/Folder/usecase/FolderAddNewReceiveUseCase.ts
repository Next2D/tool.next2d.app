import type { IShareReceiveMessage } from "@/interface/IShareReceiveMessage";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Folder } from "@/core/domain/model/Folder";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewFolderHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryUseCase";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {IShareReceiveMessage} message
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (message: IShareReceiveMessage): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip = workSpace.getLibrary(libraryId) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const folder = new Folder({
        "id": message.data[2] as NonNullable<number>,
        "name": message.data[3] as NonNullable<string>,
        "folderId": message.data[4] as NonNullable<number>,
        "type": $FOLDER_TYPE,
        "mode": "close"
    });

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(workSpace, folder);

    // 作業履歴に残す
    // fixed logic
    await libraryAreaAddNewFolderHistoryUseCase(
        workSpace,
        movieClip,
        folder,
        true
    );
};