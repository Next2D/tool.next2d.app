import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description 指定のインスタンスがライブラリに表示されるかの判定
 *              Determines whether a given instance appears in the library
 *
 * @param  {Instance} instance
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (instance: InstanceImpl<any>): boolean =>
{
    const workSpace = $getCurrentWorkSpace();

    let folderId = instance.folderId;
    while (folderId) {

        const parentInstance = workSpace.getLibrary(folderId);
        if (!parentInstance) {
            break;
        }

        // フォルダの開閉状態をチェック
        if (parentInstance.mode === "close") {
            return false;
        }

        folderId = parentInstance.folderId;
    }

    return true;
};