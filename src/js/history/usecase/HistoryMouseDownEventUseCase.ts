import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as historyRedoUseCase } from "./HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "./HistoryUndoUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";
import { $useSocket } from "@/share/application/ShareUtil";

/**
 * @description 指定のIndexまで作業履歴を更新する
 *              Update work history to specified Index
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // 全てのメニューを非表示にする
    $allHideMenu();

    // 画面共有中なら解放
    if (!userAllFunctionStateService() && !$useSocket()) {
        billingModelShowService();
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const index: number = parseInt(element.dataset.index as string);

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;
    if (scene.historyIndex > index) {
        while (scene.historyIndex !== index) {
            historyUndoUseCase(workSpace.id, scene.id);
        }
    } else {
        while (index >= scene.historyIndex) {
            historyRedoUseCase(workSpace.id, scene.id);
        }
    }
};