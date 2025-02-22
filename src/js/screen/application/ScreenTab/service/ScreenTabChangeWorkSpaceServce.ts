import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $changeCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenTabMenuHideService } from "@/menu/application/ScreenTabMenu/service/ScreenTabMenuHideService";

/**
 * @description 指定のWorkSpaceに切り替える
 *              Switch to the specified WorkSpace
 *
 * @params {WorkSpace} work_space
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (work_space: WorkSpace): Promise<void> =>
{
    if (work_space.active) {
        // アクティブなWorkSpaceならプロジェクト一覧のメニューを閉じる
        screenTabMenuHideService();
    } else {
        // 指定のWorkSpaceに切り替える
        await $changeCurrentWorkSpace(work_space);
    }
};