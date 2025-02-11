import type { Folder } from "@/core/domain/model/Folder";
import type { Instance } from "@/core/domain/model/Instance";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 指定のインスタンスがライブラリに表示されるかの判定
 *              Determines whether a given instance appears in the library
 *
 * @param  {I} instance
 * @return {boolean}
 * @method
 * @public
 */
export const execute = <I extends Instance> (instance: I): boolean =>
{
    const workSpace = $getCurrentWorkSpace();

    let folderId = instance.folderId;
    while (folderId) {

        const folder = workSpace.getLibrary(folderId) as Folder;
        if (!folder) {
            break;
        }

        // フォルダの開閉状態をチェック
        if (folder.mode === "close") {
            return false;
        }

        folderId = folder.folderId;
    }

    return true;
};