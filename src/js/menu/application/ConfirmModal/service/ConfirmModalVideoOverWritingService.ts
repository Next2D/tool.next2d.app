import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Video } from "@/core/domain/model/Video";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaUpdateVideoHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Video/usecase/LibraryAreaUpdateVideoHistoryUseCase";

/**
 * @description Videoクラスのデータを上書きする
 *              Overwrite data in Video class
 *
 * @param  {File} file
 * @param  {string} path
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (file: File, path: string): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        const names = file.name.split(".");
        names.pop();
        const name = names.join(".");

        const pathName = path ? `${path}/${name}` : name;
        const workSpace = $getCurrentWorkSpace();
        if (!workSpace.pathMap.has(pathName)) {
            return resolve();
        }

        const libraryId = workSpace.pathMap.get(pathName) as NonNullable<number>;
        const instance: InstanceImpl<Video> = workSpace.getLibrary(libraryId);
        if (!instance) {
            return resolve();
        }

        file
            .arrayBuffer()
            .then(async (buffer: ArrayBuffer): Promise<void> =>
            {
                // 上書き履歴を残す
                const beforeObject = instance.toObject();

                // データを上書き
                instance.buffer = new Uint8Array(buffer);
                await instance.wait();

                // 上書き履歴を残す
                libraryAreaUpdateVideoHistoryUseCase(
                    workSpace,
                    workSpace.scene,
                    beforeObject,
                    instance
                );

                resolve();
            });
    });
};