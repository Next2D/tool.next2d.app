import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabGetTextElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetTextElementService";
import { execute as screenTabGetListElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetListElementService";
import { $getWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description プロジェクト名を変更前の状態に更新する
 *              Update the project name to the status before the change
 *
 * @param  {number} work_space_id
 * @param  {string} before_name
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space_id: number, before_name: string): void =>
{
    const workSpace: WorkSpace | null = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 起動中ならタブと一覧の表示を更新
    if (workSpace.active) {
        const textElement: HTMLElement | null = screenTabGetTextElementService(workSpace.id);
        if (!textElement) {
            return ;
        }

        const listElement: HTMLElement | null = screenTabGetListElementService(workSpace.id);
        if (!listElement) {
            return ;
        }

        listElement.textContent = textElement.textContent = before_name;
    }

    // 内部情報を更新
    workSpace.name = before_name;
};