import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerWindowResizeUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { execute as timelineHeaderWindowResizeUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as screenScrollResizeService } from "@/screen/application/ScreenScroll/service/ScreenScrollResizeService";
import { execute as libraryAreaScrollUpdateHeightService } from "@/controller/application/LibraryAreaScroll/service/LibraryAreaScrollUpdateHeightService";
import { execute as propertyAreaScrollUpdateHeightService } from "@/controller/application/PropertyAreaScroll/service/PropertyAreaScrollUpdateHeightService";
import { execute as historyAreaScrollUpdateHeightService } from "@/controller/application/HistoryAreaScroll/service/HistoryAreaScrollUpdateHeightService";

/**
 * @description リサイズイベントを登録
 *              Register resize event
 *
 * @return {void}
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

        requestAnimationFrame((): void =>
        {
            // タイムラインをリサイズ
            timelineLayerWindowResizeUseCase();

            // タイムラインヘッダーをリサイズ
            timelineHeaderWindowResizeUseCase();

            // スクロールバーの高さを更新
            screenScrollResizeService();
            libraryAreaScrollUpdateHeightService();
            propertyAreaScrollUpdateHeightService();
            historyAreaScrollUpdateHeightService();
        });
    });
};