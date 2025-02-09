import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as zoomToolPointerMoveEventUseCase } from "./ZoomToolPointerMoveEventUseCase";

/**
 * @description ズームinputの値のマウスアップイベント
 *              Mouse up event of the value of the zoom input
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

    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // windowのイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        zoomToolPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);

    // input要素のフォーカス
    element.focus();
};