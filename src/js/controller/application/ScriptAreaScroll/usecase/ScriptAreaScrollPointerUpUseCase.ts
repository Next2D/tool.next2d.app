import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptAreaScrollPointerMoveUseCase } from "./ScriptAreaScrollPointerMoveUseCase";

/**
 * @description JSエリアのスクロールバーのマウスアップイベント
 *              Mouse up event of the JS area scroll bar
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
    element.removeEventListener(EventType.POINTER_MOVE, scriptAreaScrollPointerMoveUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
};