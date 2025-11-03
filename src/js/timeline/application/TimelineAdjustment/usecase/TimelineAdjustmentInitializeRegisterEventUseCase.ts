import { $TIMELINE_ADJUSTMENT_X_ID, $TIMELINE_ADJUSTMENT_Y_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineAdjustmentXPointerDownEventUseCase } from "./TimelineAdjustmentXPointerDownEventUseCase";
import { execute as timelineAdjustmentYPointerDownEventUseCase } from "./TimelineAdjustmentYPointerDownEventUseCase";

/**
 * @description タイムラインの幅と高さの調整イベント登録
 *              Timeline width and height adjustment event registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const xAdjElement: HTMLElement | null = document
        .getElementById($TIMELINE_ADJUSTMENT_X_ID);

    if (xAdjElement) {
        xAdjElement.addEventListener(EventType.POINTER_DOWN,
            timelineAdjustmentXPointerDownEventUseCase
        );
    }

    const yAdjElement: HTMLElement | null = document
        .getElementById($TIMELINE_ADJUSTMENT_Y_ID);

    if (yAdjElement) {
        yAdjElement.addEventListener(EventType.POINTER_DOWN,
            timelineAdjustmentYPointerDownEventUseCase
        );
    }
};