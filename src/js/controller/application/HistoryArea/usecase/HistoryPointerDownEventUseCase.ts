import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $useSocket } from "@/share/ShareUtil";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";
import { execute as historyRedoUseCase } from "./HistoryRedoUseCase";
import { execute as historyUndoUseCase } from "./HistoryUndoUseCase";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

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
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !timelineHeader.stopFlag // 再生中は処理しない
    ) {
        return ;
    }

    // 全てのメニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 親のイベントを中止
    event.stopPropagation();

    // 画面共有中か、広告を見たユーザーでなければ、モーダルを表示して終了
    if (!userAllFunctionStateService() && !$useSocket()) {
        await billingModelShowService();
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const parentElement = element.parentElement;
    if (!parentElement) {
        return ;
    }

    const children = parentElement.children;
    if (!children || !children.length) {
        return ;
    }

    // 指定のMovieClipを取得
    const workSpace = $getCurrentWorkSpace();
    const index = parseInt(element.dataset.index as string);
    if (workSpace.historyIndex > index) {
        while (workSpace.historyIndex !== index) {
            const element = children[workSpace.historyIndex - 1] as HTMLElement;
            if (!element) {
                break;
            }

            const libraryId = parseInt(element.dataset.libraryId as string);
            if (!await historyUndoUseCase(workSpace.id, libraryId)) {
                break;
            }
        }
    } else {
        while (index >= workSpace.historyIndex) {
            const element = children[workSpace.historyIndex] as HTMLElement;
            if (!element) {
                break;
            }

            const libraryId = parseInt(element.dataset.libraryId as string);
            if (!await historyRedoUseCase(workSpace.id, libraryId)) {
                break;
            }
        }
    }

    // データ保存
    await userDatabaseAutoSaveReservationUseCase();
};