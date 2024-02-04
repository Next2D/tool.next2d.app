import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description WorkSpaceの内部情報への登録処理関数
 *              Registration processing function to internal information of WorkSpace
 *
 * @param {WorkSpace} work_space
 * @param {object} instance
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace, instance: InstanceImpl<any>): void =>
{
    work_space.libraries.set(instance.id, instance);
    work_space.pathMap.set(instance.getPath(work_space), instance.id);
};