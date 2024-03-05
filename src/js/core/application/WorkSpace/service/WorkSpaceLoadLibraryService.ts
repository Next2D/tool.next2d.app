import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceSaveObjectImpl } from "@/interface/InstanceSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "@/interface/MovieClipSaveObjectImpl";
import { execute as workSpaceCreateToSaveDataService } from "./WorkSpaceCreateToSaveDataService";

/**
 * @description 保存データからライブラリ情報を復元
 *              Restore library information from stored data
 *
 * @param  {WorkSpace} work_space
 * @param  {array} libraries
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    libraries: InstanceSaveObjectImpl[]
): Promise<void> => {

    // 復元処理
    for (let idx: number = 0; idx < libraries.length; ++idx) {

        const libraryObject = libraries[idx];

        // rootの読み込み
        if (libraryObject.id === 0) {
            work_space.root.load(libraryObject as MovieClipSaveObjectImpl);
            continue;
        }

        // インスタンスオブジェクトを作成してマップに登録、初回はライブラリだけに登録
        const instance = await workSpaceCreateToSaveDataService(libraryObject);
        work_space.libraries.set(instance.id, instance);
    }
};