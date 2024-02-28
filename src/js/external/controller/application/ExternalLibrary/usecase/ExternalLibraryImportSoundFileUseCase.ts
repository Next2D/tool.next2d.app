import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import { Sound } from "@/core/domain/model/Sound";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaAddNewSoundHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Sound/usecase/LibraryAreaAddNewSoundHistoryUseCase";

/**
 * @description 音声の読み込み実行処理関数
 *              Load and execute audio processing functions
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
        const externalLibrary = new ExternalLibrary(work_space);
        const folder: ExternalInstanceImpl<ExternalFolder> | null = externalLibrary.getItem(path);
        const folderId = folder && folder.type === "folder" ? folder.id : 0;

        const sound = new Sound({
            "id": work_space.nextLibraryId,
            "type": "sound",
            "name": name,
            "folderId": folderId
        });

        // 内部情報に登録
        externalWorkSpaceRegisterInstanceService(work_space, sound);

        file
            .arrayBuffer()
            .then(async (array_buffer: ArrayBuffer): Promise<void> =>
            {
                sound.buffer = new Uint8Array(array_buffer);

                // 映像内部データの読み込み開始
                await sound.wait();

                // 作業履歴に残す
                // fixed logic
                await libraryAreaAddNewSoundHistoryUseCase(
                    work_space,
                    work_space.scene,
                    sound
                );

                // 終了
                resolve();
            });
    });
};