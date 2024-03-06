import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";

/**
 * @description フォルダーの削除処理関数
 *              Folder deletion processing function
 *
 * @param  {WorkSpace} work_space
 * @param  {number} folder_id
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (work_space: WorkSpace, folder_id: number): Promise<void> =>
{
    // 外部APIを起動
    const externalLibrary = new ExternalLibrary(work_space);

    // フォルダ内のアイテムを削除
    for (const instance of work_space.libraries.values()) {
        if (instance.folderId !== folder_id) {
            continue;
        }

        await externalLibrary
            .removeItem(instance.getPath(work_space), false);
    }
};