import { $TIMELINE_LAYER_LOCK_ALL_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolLockAllUseCase } from "./TimelineToolLockAllUseCase";

/**
 * @description レイヤーの全体のロックツールのイベント登録
 *              Event registration for the entire layer lock tool
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_LOCK_ALL_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.MOUSE_DOWN,
        timelineToolLockAllUseCase
    );
};