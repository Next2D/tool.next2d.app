import type { Instance } from "@/core/domain/model/Instance";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description WorkSpaceの内部情報からの削除処理関数
 *              Deletion processing function from WorkSpace internal information
 *
 * @param {WorkSpace} work_space
 * @param {object} instance
 * @method
 * @public
 */
export const execute = <I extends Instance> (work_space: WorkSpace, instance: I): void =>
{
    work_space.libraries.delete(instance.id);
    work_space.pathMap.delete(instance.getPath(work_space));

    if (instance.symbol) {
        work_space.symbolMap.delete(instance.symbol);
    }
};