import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollYWindowMoveUseCase } from "./TimelineScrollYPointerMoveUseCase";

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

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 登録されたイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, timelineScrollYWindowMoveUseCase);
    element.removeEventListener(EventType.MOUSE_UP, execute);
};