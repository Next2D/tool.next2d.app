import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaScrollBarPointerMoveEventUseCase } from "./LibraryAreaScrollPointerMoveEventUseCase";

/**
 * @description ライブラリエリアのスクロールバーのマウスアップイベント
 *              Mouse up event of the library area scrollbar
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLElement;
    if (!element) {
        return;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // スクロールバーの移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        libraryAreaScrollBarPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
};