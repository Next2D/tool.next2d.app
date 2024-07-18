import type { Shape } from "@/core/domain/model/Shape";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 新規Shape追加処理のUndo関数
 *              Undo function for new Shape addition process
 *
 * @param  {number} work_space_id
 * @param  {object} shape_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    shape_object: ShapeSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const shape: InstanceImpl<Shape> | null = workSpace.getLibrary(shape_object.id);
    if (!shape) {
        return ;
    }

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(workSpace, shape);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};