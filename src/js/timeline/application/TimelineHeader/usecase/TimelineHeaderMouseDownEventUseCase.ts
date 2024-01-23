import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインヘッダーのマウスダウンイベント処理関数
 *              Timeline header mouse down event handling function
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベント停止
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示に更新
    $allHideMenu();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 選択したレイヤー・フレーム Elementを初期化
    timelineLayerAllClearSelectedElementService();

    // 選択中の内部情報を初期化
    // fixed logic
    $getCurrentWorkSpace().scene.clearSelectedLayer();

    // マウスで指定したElementのフレームをセット
    const frame: number = parseInt(element.dataset.frame as string);

    // フレームの表示を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();
};