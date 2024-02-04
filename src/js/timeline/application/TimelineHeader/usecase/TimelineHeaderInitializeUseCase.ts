import { $TIMELINE_CONTROLLER_BASE_ID } from "@/config/TimelineConfig";
import { execute as timelineHeaderUpdateClientWidthService } from "../service/TimelineHeaderUpdateClientWidthService";
import { execute as timelineHeaderWheelEventUseCase } from "./TimelineHeaderWheelEventUseCase";

/**
 * @description タイムラインのヘッダー初期起動ユースケース
 *              Timeline Header Initial Launch Use Case
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 表示幅を更新
    timelineHeaderUpdateClientWidthService();

    // ヘッダー全体のイベントを登録
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (element) {
        element.addEventListener("wheel", timelineHeaderWheelEventUseCase);
    }
};