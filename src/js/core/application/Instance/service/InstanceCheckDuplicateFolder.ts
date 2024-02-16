import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description ライブラリエリアの移動する先のフォルダーが自分の親フォルダーかチェック
 *              Check if the destination folder in the library area is your parent folder
 *
 * @param  {WorkSpace} work_space
 * @param  {Instance} instance
 * @param  {number} folder_id
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    instance: InstanceImpl<any>,
    folder_id: number
): boolean => {

    let folderId = instance.folderId;

    while (folderId) {

        const instance = work_space.getLibrary(folderId);
        if (!instance) {
            return false;
        }

        if (instance.id === folder_id) {
            return true;
        }

        folderId = instance.folderId;
    }

    return false;
};