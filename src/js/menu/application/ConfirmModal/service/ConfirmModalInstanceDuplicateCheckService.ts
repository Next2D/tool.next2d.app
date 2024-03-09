import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import type { MenuImpl } from "@/interface/MenuImpl";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 重複したInstanceを内部配列にpush
 *              Push duplicate Instance to internal array
 *
 * @param  {WorkSpace} work_space
 * @param  {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    target_work_space: WorkSpace,
    instance: InstanceImpl<any>
): boolean => {

    const path = instance.getPath(target_work_space);
    const workSpace = $getCurrentWorkSpace();
    if (!workSpace.pathMap.has(path)) {
        return false;
    }

    const menu: MenuImpl<ConfirmModal> | null = $getMenu($CONFIRM_MODAL_NAME);
    if (!menu) {
        return false;
    }

    // 重複を配列に格納
    menu.instanceObjects.push({
        "targetWorkSpaceId": target_work_space.id,
        "instanceId": instance.id,
        "path": path
    });

    return true;
};