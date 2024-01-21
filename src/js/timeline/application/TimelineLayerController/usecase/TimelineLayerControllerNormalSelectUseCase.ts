import type { Layer } from "@/core/domain/model/Layer";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { $getLeftFrame } from "../../TimelineUtil";
import { execute as timelineLayerFrameActiveElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameActiveElementService";
import { execute as timelineLayerRegisterLayerAndFrameService } from "@/timeline/application/TimelineLayer/service/TimelineLayerRegisterLayerAndFrameService";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { execute as timelineLayerAllClearSelectedElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllClearSelectedElementService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 通常のレイヤーコントローラーエリア選択の処理関数（Alt、Shiftなし）
 *              Processing function for normal layer controller area selection (without Alt and Shift)
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // 表示Elementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    const element: HTMLElement | null = layerElement.lastElementChild as NonNullable<HTMLElement>;

    // 全てのレイヤー・フレーム Elementを非アクティブにする
    timelineLayerAllClearSelectedElementService();

    // 選択中の内部情報を初期化
    // fixed logic
    timelineLayer.clearSelectedTarget();

    // 現在のフレーム番号から対象のフレームElementを取得
    const frameIndex = timelineFrame.currentFrame - $getLeftFrame();

    const frameElement: HTMLElement | null = element.children[frameIndex] as HTMLElement;
    if (frameElement) {
        // 対象のフレームElementをアクティブ表示にする
        timelineLayerFrameActiveElementService(frameElement);

        // 選択情報を登録
        const frame = parseInt(frameElement.dataset.frame as string);
        timelineLayerRegisterLayerAndFrameService(layer, frame);
    } else {
        // Elementが表示されてない時は指定レイヤーと現在のフレーム番号をアクティブにする
        timelineLayerRegisterLayerAndFrameService(
            layer, timelineFrame.currentFrame
        );
    }

    // レイヤーElementをアクティブ表示にする
    timelineLayerActiveElementService(layerElement);
};