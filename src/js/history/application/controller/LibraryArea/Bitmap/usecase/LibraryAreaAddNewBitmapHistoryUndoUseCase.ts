import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalWorkSpaceRemoveInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRemoveInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 新規bitmap追加処理のUndo関数
 *              Undo function for new bitmap addition process
 *
 * @param  {number} work_space_id
 * @param  {object} bitmap_save_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    bitmap_save_object: BitmapSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const bitmap: InstanceImpl<Bitmap> | null = workSpace.getLibrary(bitmap_save_object.id);
    if (!bitmap) {
        return ;
    }

    // 内部情報から削除
    externalWorkSpaceRemoveInstanceService(workSpace, bitmap);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        libraryAreaReloadUseCase();
    }
};