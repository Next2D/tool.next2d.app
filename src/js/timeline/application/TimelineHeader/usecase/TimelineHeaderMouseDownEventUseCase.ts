import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerFrameClearSelectedElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameClearSelectedElementService";
import { execute as timelineLayerClearSelectedLayerService } from "@/timeline/application/TimelineLayer/service/TimelineLayerClearSelectedLayerService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

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

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 選択したフレームElementを初期化
    timelineLayerFrameClearSelectedElementService();

    // 選択したレイヤーElementを初期化
    timelineLayerClearSelectedLayerService();

    // 選択中の内部情報を初期化
    // fixed logic
    timelineLayer.clearSelectedTarget();

    // マウスで指定したElementのフレームをセット
    const frame: number = parseInt(element.dataset.frame as string);

    // フレームの表示を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();
};