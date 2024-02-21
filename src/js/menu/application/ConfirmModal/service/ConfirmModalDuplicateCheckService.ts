import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import type { MenuImpl } from "@/interface/MenuImpl";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description 重複したFileを内部配列にpush
 *              Push duplicate File to internal array
 *
 * @param  {WorkSpace} work_space
 * @param  {File} file
 * @param  {string} path
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    file: File,
    path: string
): boolean => {

    const names = file.name.split(".");
    names.pop();
    const name = names.join(".");

    const pathName = path ? `${path}/${name}` : name;
    if (!work_space.pathMap.has(pathName)) {
        return false;
    }

    const menu: MenuImpl<ConfirmModal> | null = $getMenu($CONFIRM_MODAL_NAME);
    if (!menu) {
        return false;
    }

    const instanceId = work_space.pathMap.get(pathName) as NonNullable<number>;
    const instance = work_space.getLibrary(instanceId);
    if (!instance) {
        return false;
    }

    // 重複を配列に格納
    menu.fileObjects.push({
        "file": file,
        "instance": instance,
        "path": path
    });

    return true;
};