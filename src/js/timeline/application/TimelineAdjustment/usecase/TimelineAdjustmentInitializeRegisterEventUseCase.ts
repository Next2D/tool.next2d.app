import { $TIMELINE_ADJUSTMENT_X_ID, $TIMELINE_ADJUSTMENT_Y_ID } from "../../../../config/TimelineConfig";
import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as timelineAdjustmentXRegisterEventUseCase } from "./TimelineAdjustmentXRegisterEventUseCase";
import { execute as timelineAdjustmentYRegisterEventUseCase } from "./TimelineAdjustmentYRegisterEventUseCase";

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
        xAdjElement.addEventListener(EventType.MOUSE_DOWN, timelineAdjustmentXRegisterEventUseCase);
    }

    const yAdjElement: HTMLElement | null = document
        .getElementById($TIMELINE_ADJUSTMENT_Y_ID);

    if (yAdjElement) {
        yAdjElement.addEventListener(EventType.MOUSE_DOWN, timelineAdjustmentYRegisterEventUseCase);
    }
};