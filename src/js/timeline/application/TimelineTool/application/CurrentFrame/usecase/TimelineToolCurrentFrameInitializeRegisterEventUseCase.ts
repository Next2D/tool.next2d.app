import { $TIMELINE_CURRENT_FRAME_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { execute as timelineToolCurrentFrameMouseDownEventUseCase } from "./TimelineToolCurrentFrameMouseDownEventUseCase";
import { execute as timelineToolCurrentFrameMouseOverEventService } from "../service/TimelineToolCurrentFrameMouseOverEventService";

/**
 * @description タイムラインの現在フレームのInput Elementのイベントを登録
 *              Registers an event for the Input Element in the current frame of the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CURRENT_FRAME_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolCurrentFrameMouseDownEventUseCase
    );

    element.addEventListener(EventType.MOUSE_OVER,
        timelineToolCurrentFrameMouseOverEventService
    );

    element.addEventListener(EventType.MOUSE_OUT, (event: PointerEvent): void =>
    {
        event.stopPropagation();
        event.preventDefault();
        element.setAttribute("style", "");
    });

    element.addEventListener("focusin", (): void =>
    {
        $updateKeyLock(true);
    });
    element.addEventListener("focusout", (): void =>
    {
        $updateKeyLock(false);
    });
};