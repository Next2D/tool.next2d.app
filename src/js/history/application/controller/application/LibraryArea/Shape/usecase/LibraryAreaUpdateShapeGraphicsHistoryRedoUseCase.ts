import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Shape } from "@/core/domain/model/Shape";

/**
 * @description 新規Shape追加処理のRedo関数
 *              Redo function for new Shape addition process
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

    const shape = new Shape(shape_object);

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, shape);

    // 起動中のプロジェクトならライブラリエリアを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};