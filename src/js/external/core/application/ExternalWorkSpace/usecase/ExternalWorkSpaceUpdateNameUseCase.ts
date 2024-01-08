import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabGetTextElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetTextElementService";
import { execute as screenTabGetListElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetListElementService";

/**
 * @description WorkSpaceの表示名を更新
 *              Update WorkSpace display name
 *
 * @param  {WorkSpace} work_space
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace, name: string): void =>
{
    if (!name) {
        name = "Untitled";
    }

    // 内部情報を更新
    work_space.name = name;

    // タブの表示情報を更新
    const textElement = screenTabGetTextElementService(work_space.id);
    if (textElement) {
        textElement.textContent = name;
    }

    // タブ一覧の表示情報を更新
    const listElement = screenTabGetListElementService(work_space.id);
    if (listElement) {
        listElement.textContent = name;
    }
};