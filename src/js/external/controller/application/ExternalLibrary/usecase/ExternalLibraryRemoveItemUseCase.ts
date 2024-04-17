
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLibraryGetItemUseCase } from "./ExternalLibraryGetItemUseCase";

/**
 * @description 指定のアイテムをライブラリエリアから削除
 *              Remove specified items from the library area
 *
 * @param  {WorkSpace} work_space
 * @param  {string} path
 * @param  {boolean} [reload = true]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    path: string,
    reload: boolean = true
): Promise<void> => {

    const item = externalLibraryGetItemUseCase(work_space, path);
    if (!item) {
        return ;
    }

    await item.remove(reload);
};