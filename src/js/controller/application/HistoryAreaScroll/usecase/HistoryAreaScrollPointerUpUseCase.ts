import { EventType } from "@/tool/domain/event/EventType";
import { execute as historyAreaScrollPointerMoveUseCase } from "./HistoryAreaScrollPointerMoveUseCase";

/**
 * @description 履歴エリアのスクロールバーのマウスアップイベント
 *              Mouse up event of the history area scroll bar
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
    event.preventDefault();

    // 登録したポインターイベントを解放
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, historyAreaScrollPointerMoveUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
};