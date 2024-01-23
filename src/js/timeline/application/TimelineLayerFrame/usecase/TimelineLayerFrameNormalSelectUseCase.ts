import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerFrameActiveElementService } from "../service/TimelineLayerFrameActiveElementService";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getLayerFromElement } from "../../TimelineUtil";

/**
 * @description 通常のフレームエリア選択の処理関数（Alt、Shiftなし）
 *              Processing function for normal frame area selection (without Alt and Shift)
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    // 表示Elementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // 選択中のフレームElementを非アクティブにする
    timelineLayerAllClearSelectedElementService();

    // 選択中の内部情報を初期化
    // fixed logic
    timelineLayer.clearSelectedTarget();

    // フレームElementをアクティブ表示にする
    timelineLayerFrameActiveElementService(element);

    // 選択したElementからフレーム番号を取得
    const frame: number = parseInt(element.dataset.frame as NonNullable<string>);

    // フレーム情報を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();

    // レイヤーElementをアクティブ表示
    timelineLayerActiveElementService(layerElement);
};