import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import { Video } from "@/core/domain/model/Video";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaAddNewVideoHistoryUseCase } from "@/history/application/controller/LibraryArea/Video/usecase/LibraryAreaAddNewVideoHistoryUseCase";

/**
 * @description 映像の読み込み実行処理関数
 *              Load and execute video processing functions
 *
 * @param  {WorkSpace} work_space
 * @param  {File} file
 * @param  {string} [name = ""]
 * @param  {string} [path = ""]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    file: File,
    name: string,
    path: string = ""
): Promise<void> => {

    return new Promise((resolve): void =>
    {
        file
            .arrayBuffer()
            .then(async (buffer): Promise<void> =>
            {
                const externalLibrary = new ExternalLibrary(work_space);
                const folder: ExternalInstanceImpl<ExternalFolder> | null = externalLibrary.getItem(path);

                const folderId = folder && folder.type === "folder" ? folder.id : 0;

                const video = new Video({
                    "id": work_space.nextLibraryId,
                    "type": "video",
                    "name": name,
                    "folderId": folderId,
                    "buffer": new Uint8Array(buffer)
                });

                // 映像内部データの読み込み開始
                await video.wait();

                // 内部情報に登録
                externalWorkSpaceRegisterInstanceService(work_space, video);

                // 作業履歴に残す
                // fixed logic
                await libraryAreaAddNewVideoHistoryUseCase(
                    work_space,
                    work_space.scene,
                    video
                );

                // 終了
                resolve();
            });
    });
};