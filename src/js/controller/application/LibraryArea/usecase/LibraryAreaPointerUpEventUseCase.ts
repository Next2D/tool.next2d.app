import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaPointerMoveEventUseCase } from "./LibraryAreaPointerMoveEventUseCase";
import { $SCREEN_ID } from "@/config/ScreenConfig";
import { execute as screenAreaDropUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaDropUseCase";
import { $setMoveState } from "../LibraryAreaUtil";
import { execute as screenAreaLibraryItemDropEndService } from "@/screen/application/ScreenArea/service/ScreenAreaLibraryItemDropEndService";

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
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 移動フラグを解除
    $setMoveState(false);

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 登録したイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, libraryAreaPointerMoveEventUseCase);
    element.removeEventListener(EventType.MOUSE_UP, execute);
    element.setAttribute("style", "");

    // スクリーンエリアへの移動処理
    const targetElement = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
    if (!targetElement || targetElement.id !== $SCREEN_ID) {
        return ;
    }

    const screenElement = document.getElementById($SCREEN_ID);
    if (!screenElement) {
        return ;
    }

    const rect = targetElement.getBoundingClientRect();

    const x = screenElement.scrollLeft + event.clientX - rect.x;
    const y = screenElement.scrollTop + event.clientY - rect.y;

    // スクリーンエリアのアイテムドロップ終了処理
    screenAreaLibraryItemDropEndService();

    // スクリーンエリアに配置
    await screenAreaDropUseCase(x, y);
};