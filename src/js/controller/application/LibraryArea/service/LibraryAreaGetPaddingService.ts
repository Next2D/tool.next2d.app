import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description 指定インスタンスがフォルダ内にあるかチェックしてネスト分のpadding値を返却
 *              Checks if the specified instance is in a folder and returns the padding value for the nested instance.
 *
 * @param  {Instance} instance
 * @return {number}
 * @method
 * @public
 */
export const execute = (instance: InstanceImpl<any>): number =>
{
    const workSpace = $getCurrentWorkSpace();

    let padding = 0;
    let folderId = instance.folderId;
    while (folderId) {

        const parentInstance = workSpace.getLibrary(folderId);
        if (!parentInstance) {
            break;
        }

        folderId = parentInstance.folderId;

        padding += 20;
    }

    return padding;
};