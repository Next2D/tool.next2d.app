import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { execute as timelineLayerWheelEventUseCase } from "./TimelineLayerWheelEventUseCase";

/**
 * @description タイムラインの初期起動ユースケース
 *              Timeline Initial Launch Use Case
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!element) {
        return ;
    }

    // スクロールイベントを登録
    element.addEventListener("wheel",
        timelineLayerWheelEventUseCase
    );
};