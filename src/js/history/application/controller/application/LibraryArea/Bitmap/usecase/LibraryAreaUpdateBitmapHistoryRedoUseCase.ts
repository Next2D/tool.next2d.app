import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description 上書き後の状態のbitmapに戻す
 *              Restore the bitmap to its post-overwrite state
 *
 * @param  {number} work_space_id
 * @param  {object} after_bitmap_object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    after_bitmap_object: BitmapSaveObjectImpl
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 上書き前のセーブデータからBitmapを復元
    const bitmap = new Bitmap(after_bitmap_object);
    workSpace.libraries.set(bitmap.id, bitmap);

    // 起動中のプロジェクトならライブラリを再描画
    if (workSpace.active) {
        // プレビューエリアを初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリ再描画
        libraryAreaReloadUseCase();
    }
};