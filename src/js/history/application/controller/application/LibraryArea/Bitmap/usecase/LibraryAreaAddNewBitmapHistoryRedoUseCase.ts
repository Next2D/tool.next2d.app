import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";

/**
 * @description 新規bitmap追加処理のRedo関数
 *              Redo function for new bitmap addition process
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

    const bitmap = new Bitmap(bitmap_save_object);

    // 内部情報に登録
    externalWorkSpaceRegisterInstanceService(workSpace, bitmap);

    // 起動中のプロジェクトならライブラリエリアを再描画
    if (workSpace.active) {

        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリを再描画
        libraryAreaReloadUseCase();
    }
};