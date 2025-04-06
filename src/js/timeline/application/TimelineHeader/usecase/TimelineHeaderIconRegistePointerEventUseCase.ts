import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderIconPointerMoveEventUseCase } from "./TimelineHeaderIconPointerMoveEventUseCase";
import { execute as timelineHeaderIconPointerUpEventUseCase } from "./TimelineHeaderIconPointerUpEventUseCase";

/**
 * @description タイムラインヘッダーアイコンのウィンドウイベント登録
 *              Window event registration of timeline header icon
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    element.setPointerCapture(event.pointerId);
    element.addEventListener(EventType.POINTER_MOVE,
        timelineHeaderIconPointerMoveEventUseCase
    );
    element.addEventListener(EventType.POINTER_UP,
        timelineHeaderIconPointerUpEventUseCase
    );
    element.addEventListener(EventType.POINTER_CANCEL,
        timelineHeaderIconPointerUpEventUseCase
    );
};