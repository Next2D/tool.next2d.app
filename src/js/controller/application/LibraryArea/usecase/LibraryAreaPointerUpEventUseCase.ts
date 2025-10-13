import { EventType } from "@/tool/domain/event/EventType";
import { $SCREEN_ID } from "@/config/ScreenConfig";
import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaPointerMoveEventService } from "../service/LibraryAreaPointerMoveEventService";
import { execute as screenAreaDropUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaDropUseCase";
import { execute as screenAreaLibraryItemDropEndService } from "@/screen/application/ScreenArea/service/ScreenAreaLibraryItemDropEndService";
import { execute as libraryAreaMoveItemsUseCase } from "./LibraryAreaMoveItemsUseCase";
import {
    $getMoveState,
    $getScrollTop,
    $setMoveState
} from "../LibraryAreaUtil";

/**
 * @description スクリーンエリアの移動処理を実行
 *              Execute the move process for the screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 登録したイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, libraryAreaPointerMoveEventService);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
    element.setAttribute("style", "");

    if (!$getMoveState()) {
        // スクリーンエリアのDisplayObjectをアクティブに戻す
        screenAreaLibraryItemDropEndService();
        return ;
    }

    // 移動フラグを解除
    $setMoveState(false);

    // スクリーンエリアへの移動処理
    const targetElement = document
        .elementFromPoint(event.clientX, event.clientY) as HTMLElement;

    if (!targetElement) {
        // スクリーンエリアのDisplayObjectをアクティブに戻す
        screenAreaLibraryItemDropEndService();
        return ;
    }

    const listBoxElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (listBoxElement) {
        listBoxElement.scrollTop = $getScrollTop();
    }

    if (targetElement.id === $SCREEN_ID) {

        // スクリーンエリアならDisplayObjectを配置
        const screenElement = document.getElementById($SCREEN_ID);
        if (!screenElement) {
            // スクリーンエリアのDisplayObjectをアクティブに戻す
            screenAreaLibraryItemDropEndService();
            return ;
        }

        const rect = targetElement.getBoundingClientRect();

        const x = screenElement.scrollLeft + event.clientX - rect.x;
        const y = screenElement.scrollTop + event.clientY - rect.y;

        // スクリーンエリアに配置
        await screenAreaDropUseCase(x, y);

    } else {

        let done = false;
        let parent: HTMLElement | null = targetElement;
        while (true) {

            switch (true) {

                case "libraryId" in parent.dataset:
                    {
                        done = true;

                        // 移動先がフォルダではない時はスキップ
                        const libraryId = parseInt(parent.dataset.libraryId as string);
                        const instance = $getCurrentWorkSpace().getLibrary(libraryId);
                        if (!instance) {
                            break;
                        }

                        await libraryAreaMoveItemsUseCase(parent);
                    }
                    break;

                case parent.id === $LIBRARY_LIST_BOX_ID:
                    // ライブラリトップに移動
                    await libraryAreaMoveItemsUseCase(parent);

                    done = true;
                    break;

                default:
                    break;

            }

            if (done) {
                break;
            }

            parent = parent.parentElement;
            if (!parent) {
                break;
            }
        }
    }

    // スクリーンエリアのDisplayObjectをアクティブに戻す
    screenAreaLibraryItemDropEndService();

    // スクリーンに配置しているDisplayObjectを非アクティブ化
    // const elements = element
    //     .querySelectorAll(".display-object") as NodeListOf<HTMLElement>;

    // for (let idx = 0; idx < elements.length; idx++) {
    //     const displayObject = elements[idx];
    //     if (!displayObject) {
    //         continue;
    //     }

    //     const container = displayObject.querySelector(".canvas-container") as HTMLDivElement;
    //     if (!container) {
    //         return ;
    //     }

    //     container.style.pointerEvents = "";
    // }
};