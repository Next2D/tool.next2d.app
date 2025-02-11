import type { Folder } from "@/core/domain/model/Folder";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description ライブラリエリアの移動する先のフォルダーが自分の親フォルダーかチェック
 *              Check if the destination folder in the library area is your parent folder
 *
 * @param  {WorkSpace} work_space
 * @param  {Instance} instance
 * @param  {number} parent_folder_id
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    instance: Folder,
    parent_folder_id: number
): boolean => {

    let folderId = instance.folderId;
    while (folderId) {

        const instance = work_space.getLibrary(folderId) as Folder;
        if (!instance) {
            return true;
        }

        if (instance.id === parent_folder_id) {
            return true;
        }

        folderId = instance.folderId;
    }

    return false;
};