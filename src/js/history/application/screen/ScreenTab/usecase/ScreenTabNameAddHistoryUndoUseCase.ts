import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabGetTextElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetTextElementService";
import { execute as screenTabGetListElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetListElementService";

/**
 * @description プロジェクト名を変更前の状態に更新する
 *              Update the project name to the status before the change
 *
 * @param  {WorkSpace} work_space
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace, name: string): void =>
{
    // 起動中ならタブと一覧の表示を更新
    if (work_space.active) {
        const textElement: HTMLElement | null = screenTabGetTextElementService(work_space.id);
        if (!textElement) {
            return ;
        }

        const listElement: HTMLElement | null = screenTabGetListElementService(work_space.id);
        if (!listElement) {
            return ;
        }

        listElement.textContent = textElement.textContent = name;
    }

    // 内部情報を更新
    work_space.name = name;
};