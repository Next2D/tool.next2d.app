import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalItem } from "@/external/core/domain/model/ExternalItem";
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
export const execute = <E extends ExternalItem> (
    work_space: WorkSpace,
    path: string
): E | null => {

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