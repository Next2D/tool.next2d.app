import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabUpdateHistoryUseCase } from "@/history/application/screen/application/ScreenTab/usecase/ScreenTabUpdateHistoryUseCase";
import { execute as screenTabUpdateElementUseCase } from "@/screen/application/ScreenTab/usecase/ScreenTabUpdateElementUseCase";

/**
 * @description WorkSpaceの表示名を更新
 *              Update WorkSpace display name
 *
 * @param  {WorkSpace} work_space
 * @param  {string} name
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    name: string,
    receiver: boolean = false
): Promise<void> => {

    // 名前が空の時は初期値をセット
    if (!name) {
        name = "Untitled";
    }

    // 変更がなければ終了
    // fixed logic
    if (work_space.name === name) {
        return ;
    }

    // 表示を更新
    await screenTabUpdateElementUseCase(work_space.id, name);

    // 作業履歴を残す
    await screenTabUpdateHistoryUseCase(work_space, name, receiver);

    // 名前を更新
    work_space.name = name || "Untitled";
};