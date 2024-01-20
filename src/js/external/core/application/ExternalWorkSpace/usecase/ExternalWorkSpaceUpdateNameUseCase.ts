import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabGetTextElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetTextElementService";
import { execute as screenTabGetListElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetListElementService";
import { execute as workSpaceUpdateNameUseCase } from "@/core/application/WorkSpace/usecase/WorkSpaceUpdateNameUseCase";

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
export const execute = (
    work_space: WorkSpace,
    name: string,
    receiver: boolean = false
): void => {

    // 変更がなければ終了
    if (work_space.name === name) {
        return ;
    }

    // 名前が空の時は初期値をセット
    if (!name) {
        name = "Untitled";
    }

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

    // 内部情報を更新
    workSpaceUpdateNameUseCase(work_space.id, name, receiver);
};