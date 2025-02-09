import { $getWorkSpace } from "@/core/application/CoreUtil";
import type { IInstance } from "@/interface/IInstance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 新規MovieClip追加処理のUndo関数
 *              Undo function for new MovieClip addition process
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

    const movieClip: IInstance<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(workSpace, movieClip);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};