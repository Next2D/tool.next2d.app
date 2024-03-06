import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as libraryAreaActiveElementService } from "../service/LibraryAreaActiveElementService";
import { execute as libraryAreaInactiveElementService } from "../service/LibraryAreaInactiveElementService";

/**
 * @description ラリブラリアイテムのAltを利用した複数選択
 *              Multiple Choice with Ralibrary Item Alt.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    const index = libraryArea.selectedIds.indexOf(library_id);
    if (index === -1) {
        // 未選択の場合は選択処理
        libraryArea.selectedIds.push(library_id);

        // アクティブ表示に更新
        libraryAreaActiveElementService(library_id);
    } else {
        // 選択中なら、選択解除
        libraryArea.selectedIds.splice(index, 1);

        // 非アクティブ表示に更新
        libraryAreaInactiveElementService(library_id);
    }
};