import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";

/**
 * @description 新規フォルダー追加処理
 *              New folder addition process
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();

    // 外部APIを起動
    const externalLibrary = new ExternalLibrary(workSpace);
    await externalLibrary
        .addNewFolder(`Folder_${workSpace.nextLibraryId}`);
};