import { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 新規MovieClip追加処理のRedo関数
 *              Redo function for new MovieClip addition process
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {string} name
 * @param  {number} folder_id
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

    const movieClip = new MovieClip({
        "id": library_id,
        "name": name,
        "type": "container",
        "folderId": folder_id
    });

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, movieClip);

    // 起動中のプロジェクトならライブラリエリアを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};