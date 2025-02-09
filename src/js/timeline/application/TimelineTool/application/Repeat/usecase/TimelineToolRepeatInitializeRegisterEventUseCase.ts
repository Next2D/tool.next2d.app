import { $TIMELINE_REPEAT_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolRepeatMouseDownEventUseCase } from "./TimelineToolRepeatMouseDownEventUseCase";

/**
 * @description ループ設定のイベント登録
 *              Event registration for loop settings
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_REPEAT_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.POINTER_DOWN,
        timelineToolRepeatMouseDownEventUseCase
    );
};