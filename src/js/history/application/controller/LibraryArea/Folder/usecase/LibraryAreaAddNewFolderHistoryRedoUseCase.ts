import { Folder } from "@/core/domain/model/Folder";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 新規フォルダ追加処理のRedo関数
 *              Redo function for new folder addition process
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    name: string,
    folder_id: number
): void =>
{
    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const folder = new Folder({
        "id": library_id,
        "type": "folder",
        "name": name,
        "mode": "close",
        "folderId": folder_id
    });

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, folder);

    // 起動中のプロジェクトならライブラリエリアを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};