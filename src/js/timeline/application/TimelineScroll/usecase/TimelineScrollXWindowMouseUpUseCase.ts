import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollXWindowMoveUseCase } from "./TimelineScrollXWindowMoveUseCase";

/**
 * @description x座標移動イベントの終了関数
 *              End function for x-coordinate move event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    // 登録されたイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineScrollXWindowMoveUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};