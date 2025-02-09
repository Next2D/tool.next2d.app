import type { IInstance } from "@/interface/IInstance";
import { Sound } from "@/core/domain/model/Sound";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaUpdateSoundHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Sound/usecase/LibraryAreaUpdateSoundHistoryUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { $SOUND_TYPE } from "@/config/InstanceConfig";

/**
 * @description Soundクラスのデータを上書きする
 *              Overwrite data in Sound class
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
    const instance: IInstance<Sound> = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    // 新規Soundを作成して、共通部分をinstanceから取得
    const sound = new Sound({
        "id": instance.id,
        "type": $SOUND_TYPE,
        "name": instance.name,
        "folderId": instance.folderId,
        "buffer": new Uint8Array(await file.arrayBuffer())
    });

    // データを上書き
    await sound.wait();

    // 上書き履歴を残す
    libraryAreaUpdateSoundHistoryUseCase(
        workSpace,
        workSpace.scene,
        instance.toObject(),
        sound
    );

    // 内部情報を上書き
    workSpace.libraries.set(sound.id, sound);

    if (workSpace.active) {
        // 選択状態を初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリ再描画
        libraryAreaReloadUseCase();
    }
};