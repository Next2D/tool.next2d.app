import type { Instance } from "@/core/domain/model/Instance";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description WorkSpaceの内部情報への登録処理関数
 *              Registration processing function to internal information of WorkSpace
 *
 * @param {WorkSpace} work_space
 * @param {I} instance
 * @method
 * @public
 */
export const execute = <I extends Instance> (work_space: WorkSpace, instance: I): void =>
{
    work_space.libraries.set(instance.id, instance);
    work_space.pathMap.set(instance.getPath(work_space), instance.id);

    if (instance.symbol) {
        work_space.symbolMap.set(instance.symbol, instance.id);
    }
};