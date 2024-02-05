import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { Folder } from "@/core/domain/model/Folder";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewFolderHistoryUseCase } from "@/history/application/controller/LibraryArea/Folder/usecase/LibraryAreaAddNewFolderHistoryUseCase";

/**
 * @description 新規フォルダーの追加ユースケース
 *              Add New Folder Use Case
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string} name
 * @param  {number} folder_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    name: string,
    folder_id: number = 0
): Folder => {

    // フォルダのデータを生成
    const folder = new Folder({
        "id": work_space.nextLibraryId,
        "name": name,
        "folderId": folder_id,
        "type": "folder",
        "mode": "close"
    });

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(work_space, folder);

    // 作業履歴に残す
    // fixed logic
    libraryAreaAddNewFolderHistoryUseCase(
        work_space,
        movie_clip,
        folder
    );

    return folder;
};