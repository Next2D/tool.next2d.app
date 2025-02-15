import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { Folder } from "@/core/domain/model/Folder";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewFolderHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryUseCase";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";

/**
 * @description 新規フォルダーの追加ユースケース
 *              Add New Folder Use Case
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string} name
 * @param  {number} folder_id
 * @param  {boolean} [reload = true]
 * @return {Folder}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    name: string,
    folder_id: number = 0,
    reload: boolean = true
): Promise<Folder> => {

    // フォルダのデータを生成
    const folder = new Folder({
        "id": work_space.nextLibraryId,
        "name": name,
        "folderId": folder_id,
        "type": $FOLDER_TYPE,
        "mode": "close"
    });

    // 名前の重複時は改名
    while (work_space.pathMap.has(folder.getPath(work_space))) {
        folder.name += "_(2)";
    }

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(work_space, folder, reload);

    // 作業履歴に残す
    // fixed logic
    await libraryAreaAddNewFolderHistoryUseCase(
        work_space,
        movie_clip,
        folder
    );

    return folder;
};