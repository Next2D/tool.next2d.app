import type { Folder } from "@/core/domain/model/Folder";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as workSpaceCreatePathMapService } from "@/core/application/WorkSpace/service/WorkSpaceCreatePathMapService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";

/**
 * @description フォルダ移動処理のRedo関数
 *              Redo function for folder move process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} after_folder_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    after_folder_id: number
): void =>
{
    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const folder: InstanceImpl<Folder> | null = workSpace.getLibrary(library_id);
    if (!folder) {
        return ;
    }

    folder.folderId = after_folder_id;

    // path mapを再生成
    workSpaceCreatePathMapService(workSpace);

    // pathの内部情報を並び替える
    libraryAreaReOrderingService(workSpace);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};