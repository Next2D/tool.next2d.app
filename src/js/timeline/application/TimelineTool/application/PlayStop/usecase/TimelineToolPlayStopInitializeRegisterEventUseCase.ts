import { $TIMELINE_PLAY_STOP_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolPlayStopMouseDownEventUseCase } from "./TimelineToolPlayStopMouseDownEventUseCase";

/**
 * @description 再生・停止ボタンのイベント登録
 *              Event registration for play/stop button
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_PLAY_STOP_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.POINTER_DOWN,
        timelineToolPlayStopMouseDownEventUseCase
    );
};