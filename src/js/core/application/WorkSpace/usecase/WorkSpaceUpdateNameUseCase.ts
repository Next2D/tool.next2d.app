import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabUpdateHistoryUseCase } from "@/history/application/screen/ScreenTab/usecase/ScreenTabUpdateHistoryUseCase";
import { $getWorkSpace } from "../../CoreUtil";

/**
 * @description プロジェクト名を変更
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (id: number, name: string): void =>
{
    const workSpace: WorkSpace | null = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    // 作業履歴を残す
    screenTabUpdateHistoryUseCase(workSpace, name);

    // 名前を更新
    workSpace.name = name || "Untitled";
};