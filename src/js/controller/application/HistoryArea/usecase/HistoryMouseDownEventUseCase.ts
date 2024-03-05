import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $useSocket } from "@/share/ShareUtil";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";
import { execute as historyRedoUseCase } from "./HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "./HistoryUndoUseCase";

/**
 * @description 指定のIndexまで作業履歴を更新する
 *              Update work history to specified Index
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
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

    // 指定のMovieClipを取得
    const workSpace = $getCurrentWorkSpace();
    const libraryId: number = parseInt(element.dataset.libraryId as string);
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    const index: number = parseInt(element.dataset.index as string);
    if (workSpace.historyIndex > index) {
        while (workSpace.historyIndex !== index) {
            await historyUndoUseCase(workSpace.id, movieClip.id);
        }
    } else {
        while (index >= workSpace.historyIndex) {
            await historyRedoUseCase(workSpace.id, movieClip.id);
        }
    }
};