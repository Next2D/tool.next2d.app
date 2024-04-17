import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLibraryCreateInstanceService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibraryCreateInstanceService";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description 指定のライブラリアイテムを返却
 *              Returns the specified library item
 *
 * @param {WorkSpace} work_space
 * @param {string} path
 * @return {ExternalInstanceImpl<any> | null}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    path: string
): ExternalInstanceImpl<any> | null => {

    if (!work_space.pathMap.has(path)) {
        return null;
    }

    const libraryId = work_space.pathMap.get(path) as NonNullable<number>;
    const instance: InstanceImpl<any> | null = work_space.getLibrary(libraryId);
    if (!instance) {
        return null;
    }

    // タイプ別のクラスを作成
    return externalLibraryCreateInstanceService(work_space, instance);
};