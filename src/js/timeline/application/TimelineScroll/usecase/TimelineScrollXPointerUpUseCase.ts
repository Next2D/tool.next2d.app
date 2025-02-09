import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollXPointerMoveUseCase } from "./TimelineScrollXPointerMoveUseCase";

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

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 登録されたイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE, timelineScrollXPointerMoveUseCase);
    element.removeEventListener(EventType.POINTER_UP, execute);
};