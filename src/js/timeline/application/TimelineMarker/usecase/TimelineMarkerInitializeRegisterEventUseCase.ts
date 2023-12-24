import { $TIMELINE_MARKER_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineMarkerRegisterWindowEventUseCase } from "@/timeline/application/TimelineMarker/usecase/TimelineMarkerRegisterWindowEventUseCase";

/**
 * @description タイムラインのマーカーにイベント登録
 *              Register events on timeline markers
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_MARKER_ID);

    if (!element) {
        return ;
    }

    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineMarkerRegisterWindowEventUseCase
    );
};