import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Folder } from "@/core/domain/model/Folder";
import { execute as libraryAreaMoveFolderHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaMoveFolderHistoryUseCase";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

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

    const folder: InstanceImpl<Folder> = workSpace.getLibrary(
        message.data[2] as NonNullable<number>
    );

    if (!folder) {
        return ;
    }

    const folderId = message.data[4] as NonNullable<number>;

    // 履歴に残す
    // fixed logic
    libraryAreaMoveFolderHistoryUseCase(
        workSpace,
        movieClip,
        folder,
        folderId,
        true
    );

    folder.folderId = folderId;

    // 内部情報を再生成
    workSpaceCreatePathMapService(workSpace);

    // ソートを実行
    libraryAreaReOrderingService(workSpace);

    // 実行中のプロジェクトなら再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};