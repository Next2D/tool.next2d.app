import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { Folder } from "@/core/domain/model/Folder";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 新規フォルダ追加処理のUndo関数
 *              Undo function for new folder addition process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const folder: InstanceImpl<Folder> | null = workSpace.getLibrary(library_id);
    if (!folder) {
        return ;
    }

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(workSpace, folder);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};