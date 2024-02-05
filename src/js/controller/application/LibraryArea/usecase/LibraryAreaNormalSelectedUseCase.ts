import { execute as libraryAreaAllClearElementService } from "../service/LibraryAreaAllClearElementService";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

/**
 * @description ライブラリのアイテムの単体選択の処理関数
 *              Processing function for single selection of items in the library
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    // アクティブ表示をリセット
    libraryAreaAllClearElementService();

    // 選択していたIDをリセット
    libraryArea.selectedIds.length = 0;
    libraryArea.selectedIds.push(library_id);

    const element: HTMLElement | null = document
        .getElementById(`library-child-id-${library_id}`);

    if (!element) {
        return ;
    }

    element.classList.add("active");
};