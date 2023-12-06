import { $TIMELINE_CONTROLLER_BASE_ID } from "@/config/TimelineConfig";
import { execute as timelineHeaderUpdateClientWidthService } from "../service/TimelineHeaderUpdateClientWidthService";
import { execute as timelineHeaderWindowResizeUseCase } from "./TimelineHeaderWindowResizeUseCase";
import { execute as timelineHeaderWheelEventUseCase } from "./TimelineHeaderWheelEventUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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

    // ブラウザの表示サイズに変更イベント処理
    window.addEventListener("resize", (): void =>
    {
        // 移動していれば処理終了
        const workSpace = $getCurrentWorkSpace();
        if (workSpace.timelineAreaState.state === "move") {
            return ;
        }

        requestAnimationFrame(timelineHeaderWindowResizeUseCase);
    });

    // ヘッダー全体のイベントを登録
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_BASE_ID);

    if (element) {
        element.addEventListener("wheel", timelineHeaderWheelEventUseCase);
    }
};