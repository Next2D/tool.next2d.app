import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenTabUpdateElementUseCase } from "@/screen/application/ScreenTab/usecase/ScreenTabUpdateElementUseCase";

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
export const execute = async (
    work_space_id: number,
    before_name: string
): Promise<void> => {

    const workSpace: WorkSpace | null = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // タブと一覧の表示を更新
    await screenTabUpdateElementUseCase(workSpace.id, before_name);

    // 内部情報を更新
    workSpace.name = before_name;
};