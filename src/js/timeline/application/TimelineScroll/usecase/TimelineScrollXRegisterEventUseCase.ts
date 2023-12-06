import { $TIMELINE_SCROLL_BAR_X_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineScrollXWindowRegisterEventUseCase } from "./TimelineScrollXWindowRegisterEventUseCase";

/**
 * @description タイムラインのx座標に移動するスクロールのイベント登録
 *              Register an event for a scroll that moves to the x-coordinate of the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCROLL_BAR_X_ID);

    if (!element) {
        return ;
    }

    // マウスダウンでwindowイベントを登録、マウスアップで解除
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineScrollXWindowRegisterEventUseCase
    );
};