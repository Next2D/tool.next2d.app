import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerWindowResizeUseCase } from "./TimelineLayerWindowResizeUseCase";
import { $TIMELINE_CONTENT_ID } from "@/config/TimelineConfig";
import { execute as timelineLayerWheelEventUseCase } from "./TimelineLayerWheelEventUseCase";

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
    // ブラウザの表示サイズに変更イベント処理
    window.addEventListener("resize", (): void =>
    {
        // 移動していれば処理終了
        const workSpace = $getCurrentWorkSpace();
        if (workSpace.timelineAreaState.state === "move") {
            return ;
        }

        // タイムラインをリサイズ
        requestAnimationFrame(timelineLayerWindowResizeUseCase);
    });

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