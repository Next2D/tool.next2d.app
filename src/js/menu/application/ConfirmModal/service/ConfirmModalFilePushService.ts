import type { ConfirmModal } from "@/menu/domain/model/ConfirmModal";
import type { MenuImpl } from "@/interface/MenuImpl";
import { $CONFIRM_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import { InstanceImpl } from "@/interface/InstanceImpl";

/**
 * @description 重複したFileを内部配列にpush
 *              Push duplicate File to internal array
 *
 * @param  {File} file
 * @param  {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = (file: File, instance: InstanceImpl<any>): void =>
{
    const menu: MenuImpl<ConfirmModal> | null = $getMenu($CONFIRM_MODAL_NAME);
    if (!menu) {
        return ;
    }

    menu.fileObjects.push({
        "file": file,
        "instance": instance
    });
};