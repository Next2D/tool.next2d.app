import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabUpdateHistoryUseCase } from "@/history/application/screen/ScreenTab/usecase/ScreenTabUpdateHistoryUseCase";
import { $getWorkSpace } from "../../CoreUtil";

/**
 * @description プロジェクト名を変更
 *              Change project name
 *
 * @param  {number} id
 * @param  {string} name
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (id: number, name: string, receiver: boolean = false): void =>
{
    const workSpace: WorkSpace | null = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    // 作業履歴を残す
    screenTabUpdateHistoryUseCase(workSpace, name, receiver);

    // 名前を更新
    workSpace.name = name || "Untitled";
};