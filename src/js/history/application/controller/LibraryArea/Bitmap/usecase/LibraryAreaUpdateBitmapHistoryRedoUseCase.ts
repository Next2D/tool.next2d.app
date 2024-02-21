import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { $getWorkSpace } from "@/core/application/CoreUtil";

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
};