import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollYWindowMoveUseCase } from "./TimelineScrollYWindowMoveUseCase";

/**
 * @description y座標移動イベントの終了関数
 *              End function for y-coordinate move events
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
    window.removeEventListener(EventType.MOUSE_MOVE, timelineScrollYWindowMoveUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);
};