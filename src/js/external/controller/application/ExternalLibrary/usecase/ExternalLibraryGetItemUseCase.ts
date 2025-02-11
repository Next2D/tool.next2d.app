import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IExternalInstance } from "@/interface/IExternalInstance";
import { execute as externalLibraryCreateInstanceService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibraryCreateInstanceService";

/**
 * @description 指定のライブラリアイテムを返却
 *              Returns the specified library item
 *
 * @param  {WorkSpace} work_space
 * @param  {string} path
 * @return {IExternalInstance<any> | null}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    path: string
): IExternalInstance<any> | null => {

    if (!work_space.pathMap.has(path)) {
        return null;
    }

    const libraryId = work_space.pathMap.get(path) as NonNullable<number>;
    const instance = work_space.getLibrary(libraryId);
    if (!instance) {
        return null;
    }

    // タイプ別のクラスを作成
    return externalLibraryCreateInstanceService(work_space, instance);
};