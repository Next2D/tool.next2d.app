import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IInstanceSaveObject } from "@/interface/IInstanceSaveObject";
import type { IMovieClipSaveObject } from "@/interface/IMovieClipSaveObject";
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
    libraries: IInstanceSaveObject[]
): Promise<void> => {

    // 復元処理
    for (let idx: number = 0; idx < libraries.length; ++idx) {

        const libraryObject = libraries[idx];

        // rootの読み込み
        if (libraryObject.id === 0) {
            work_space.root.load(libraryObject as IMovieClipSaveObject);
            continue;
        }

        // インスタンスオブジェクトを作成してマップに登録、初回はライブラリだけに登録
        const instance = await workSpaceCreateToSaveDataService(libraryObject);
        work_space.libraries.set(instance.id, instance);
    }
};