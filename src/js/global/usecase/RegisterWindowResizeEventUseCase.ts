import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerWindowResizeUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { execute as timelineHeaderWindowResizeUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as screenScrollResizeService } from "@/screen/application/ScreenScroll/service/ScreenScrollResizeService";
import { execute as libraryAreaScrollUpdateHeightService } from "@/controller/application/LibraryAreaScroll/service/LibraryAreaScrollUpdateHeightService";
import { execute as propertyAreaScrollUpdateHeightService } from "@/controller/application/PropertyAreaScroll/service/PropertyAreaScrollUpdateHeightService";

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

        // タイムラインとタイムラインヘッダーをリサイズ
        requestAnimationFrame(timelineLayerWindowResizeUseCase);
        requestAnimationFrame(timelineHeaderWindowResizeUseCase);

        // スクロースバーの高さを更新
        requestAnimationFrame(screenScrollResizeService);
        requestAnimationFrame(libraryAreaScrollUpdateHeightService);
        requestAnimationFrame(propertyAreaScrollUpdateHeightService);
    });
};