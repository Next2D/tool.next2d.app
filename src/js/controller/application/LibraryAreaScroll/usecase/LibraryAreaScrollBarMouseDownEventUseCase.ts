import { EventType } from "@/tool/domain/event/EventType";
import { execute as libraryAreaScrollBarPointerMoveEventUseCase } from "./LibraryAreaScrollBarPointerMoveEventUseCase";
import { execute as libraryAreaScrollBarPointerUpEventUseCase } from "./LibraryAreaScrollBarPointerUpEventUseCase";

/**
 * @description ライブラリエリアのスクロールバーのマウスダウンイベント
 *              Mouse down event of the library area scrollbar
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();

    const element = event.target as HTMLElement;
    if (!element) {
        return;
    }

    // スクロールバーの移動イベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        libraryAreaScrollBarPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        libraryAreaScrollBarPointerUpEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        libraryAreaScrollBarPointerUpEventUseCase,
        { "passive": false }
    );
};