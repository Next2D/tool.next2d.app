import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description WorkSpaceの内部情報からの削除処理関数
 *              Deletion processing function from WorkSpace internal information
 *
 * @param {WorkSpace} work_space
 * @param {object} instance
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace, instance: InstanceImpl<any>): void =>
{
    work_space.libraries.delete(instance.id);
    work_space.pathMap.delete(instance.getPath(work_space));
};