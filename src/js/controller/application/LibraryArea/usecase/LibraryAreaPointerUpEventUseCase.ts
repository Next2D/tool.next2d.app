import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaPointerMoveEventUseCase } from "./LibraryAreaPointerMoveEventUseCase";
import { $SCREEN_ID } from "@/config/ScreenConfig";
import { execute as screenAreaDropUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaDropUseCase";
import { $getMoveState, $setMoveState } from "../LibraryAreaUtil";
import { execute as screenAreaLibraryItemDropEndService } from "@/screen/application/ScreenArea/service/ScreenAreaLibraryItemDropEndService";
import { execute as libraryAreaMoveItemsUseCase } from "./LibraryAreaMoveItemsUseCase";
import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $FOLDER_TYPE } from "@/config/InstanceConfig";

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
    event.preventDefault();

    // 登録したイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, libraryAreaPointerMoveEventUseCase);
    element.removeEventListener(EventType.MOUSE_UP, execute);
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

    if (targetElement.id === $SCREEN_ID) {

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
                        if (!instance || instance.type !== $FOLDER_TYPE) {
                            break;
                        }

                        libraryAreaMoveItemsUseCase(parent);
                    }
                    break;

                case parent.id === $LIBRARY_LIST_BOX_ID:
                    // ライブラリトップに移動
                    libraryAreaMoveItemsUseCase(parent);

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
};