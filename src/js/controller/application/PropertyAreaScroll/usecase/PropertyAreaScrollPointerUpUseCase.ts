import { EventType } from "@/tool/domain/event/EventType";
import { execute as propertyAreaScrollPointerMoveUseCase } from "./PropertyAreaScrollPointerMoveUseCase";

/**
 * @description プロパティーエリアのスクロールバーのマウスアップイベント
 *              Property area scroll bar mouse up event
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
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 登録したポインターイベントを解放
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, propertyAreaScrollPointerMoveUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
};