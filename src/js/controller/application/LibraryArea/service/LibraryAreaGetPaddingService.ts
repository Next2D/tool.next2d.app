import type { Folder } from "@/core/domain/model/Folder";
import type { Instance } from "@/core/domain/model/Instance";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 指定インスタンスがフォルダ内にあるかチェックしてネスト分のpadding値を返却
 *              Checks if the specified instance is in a folder and returns the padding value for the nested instance.
 *
 * @param  {Instance} instance
 * @return {number}
 * @method
 * @public
 */
export const execute = <I extends Instance> (instance: I): number =>
{
    const workSpace = $getCurrentWorkSpace();

    let padding = 0;
    let folderId = instance.folderId;
    while (folderId) {

        const folder = workSpace.getLibrary(folderId) as Folder;
        if (!folder) {
            break;
        }

        folderId = folder.folderId;

        padding += 20;
    }

    return padding;
};