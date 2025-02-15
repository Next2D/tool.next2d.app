import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaScrollBarPointerMoveEventUseCase } from "./LibraryAreaScrollBarPointerMoveEventUseCase";

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
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLElement;
    if (!element) {
        return;
    }

    // スクロールバーの移動イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        libraryAreaScrollBarPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
};