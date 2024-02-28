import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Folder } from "@/core/domain/model/Folder";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewFolderHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryUseCase";

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
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    const folder = new Folder({
        "id": message.data[2] as NonNullable<number>,
        "name": message.data[3] as NonNullable<string>,
        "folderId": message.data[4] as NonNullable<number>,
        "type": "folder",
        "mode": "close"
    });

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(workSpace, folder);

    // 作業履歴に残す
    // fixed logic
    libraryAreaAddNewFolderHistoryUseCase(
        workSpace,
        movieClip,
        folder,
        true
    );
};