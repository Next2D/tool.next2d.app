import type { IInstance } from "@/interface/IInstance";
import { Video } from "@/core/domain/model/Video";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaUpdateVideoHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Video/usecase/LibraryAreaUpdateVideoHistoryUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { $VIDEO_TYPE } from "@/config/InstanceConfig";

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
export const execute = async (file: File, path: string): Promise<void> =>
{
    const names = file.name.split(".");
    names.pop();
    const name = names.join(".");

    const pathName = path ? `${path}/${name}` : name;
    const workSpace = $getCurrentWorkSpace();
    if (!workSpace.pathMap.has(pathName)) {
        return ;
    }

    const libraryId = workSpace.pathMap.get(pathName) as NonNullable<number>;
    const instance: IInstance<Video> = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    // 新規Videoを作成して、共通部分をinstanceから取得
    const video = new Video({
        "id": instance.id,
        "type": $VIDEO_TYPE,
        "name": instance.name,
        "folderId": instance.folderId,
        "buffer": new Uint8Array(await file.arrayBuffer())
    });

    // データを上書き
    await video.wait();

    // 上書き履歴を残す
    libraryAreaUpdateVideoHistoryUseCase(
        workSpace,
        workSpace.scene,
        instance.toObject(),
        video
    );

    // 内部情報を上書き
    workSpace.libraries.set(video.id, video);

    if (workSpace.active) {
        // 選択状態を初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリ再描画
        libraryAreaReloadUseCase();
    }
};