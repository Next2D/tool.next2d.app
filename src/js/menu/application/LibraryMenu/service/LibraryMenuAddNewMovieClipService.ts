import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";

/**
 * @description 新規MovieClip追加処理
 *              New MovieClip addition process
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
        .addNewMovieClip(`MovieClip_${workSpace.nextLibraryId}`);
};