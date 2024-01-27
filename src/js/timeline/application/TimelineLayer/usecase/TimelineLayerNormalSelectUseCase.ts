import type { Layer } from "@/core/domain/model/Layer";
import { $getLeftFrame } from "../../TimelineUtil";
import { execute as timelineLayerFrameActiveElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameActiveElementService";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";

/**
 * @description 通常のレイヤーコントローラーエリア選択の処理関数（Alt、Shiftなし）
 *              Processing function for normal layer controller area selection (without Alt and Shift)
 *
 * @param  {Layer} layer
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, frame: number): void =>
{
    // 全てのレイヤー・フレーム Elementを非アクティブにする
    timelineLayerAllClearSelectedElementService();

    // 表示Elementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // レイヤーElementをアクティブ表示に更新
    timelineLayerActiveElementService(layerElement);

    // フレーム側のElementを取得
    const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;

    // 指定のフレーム番号から対象のフレームElementを取得
    const frameIndex = frame - $getLeftFrame();

    const element: HTMLElement | null = frameElement.children[frameIndex] as HTMLElement;
    if (element) {
        // 対象のフレームElementをアクティブ表示にする
        timelineLayerFrameActiveElementService(element);
    }

    // フレーム移動があれば表示を更新
    if (timelineFrame.currentFrame !== frame) {
        // フレーム情報を更新
        timelineFrameUpdateFrameElementService(frame);

        // マーカーを移動
        timelineMarkerMovePositionService();
    }
};