import { libraryArea } from "@/controller/domain/model/LibraryArea";

/**
 * @description 指定のライブラリIDを選択状態に更新
 *              Update the specified library ID to the selected state
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    libraryArea.selectedIds.length = 0;
    libraryArea.selectedIds.push(library_id);
};