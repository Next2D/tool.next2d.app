import { execute as timelineLayerFrameClearSelectedElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameClearSelectedElementService";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { $getLeftFrame } from "../../TimelineUtil";
import { execute as timelineLayerFrameActiveElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameActiveElementService";
import { execute as timelineLayerClearSelectedLayerService } from "@/timeline/application/TimelineLayer/service/TimelineLayerClearSelectedLayerService";
import { execute as timelineLayerRegisterLayerAndFrameService } from "@/timeline/application/TimelineLayer/service/TimelineLayerRegisterLayerAndFrameService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 通常のレイヤーコントローラーエリア選択の処理関数（Alt、Shiftなし）
 *              Processing function for normal layer controller area selection (without Alt and Shift)
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number): void =>
{
    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | null = scene.getLayer(layer_id);
    if (!layer) {
        return ;
    }

    // 表示Elementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    const element: HTMLElement | null = layerElement.lastElementChild as NonNullable<HTMLElement>;

    // 選択中のフレームElementを非アクティブにする
    timelineLayerFrameClearSelectedElementService();

    // 選択中のレイヤーElementを非アクティブにする
    // fixed logic
    timelineLayerClearSelectedLayerService();

    // 現在のフレーム番号から対象のフレームElementを取得
    const frameIndex = timelineFrame.currentFrame - $getLeftFrame();

    const frameElement: HTMLElement | null = element.children[frameIndex] as HTMLElement;
    if (!frameElement) {
        // Elementが表示されてない時は指定レイヤーと現在のフレーム番号をアクティブにする
        timelineLayerRegisterLayerAndFrameService(
            layer_id, timelineFrame.currentFrame
        );
    } else {
        // 対象のフレームElementをアクティブ表示にする
        timelineLayerFrameActiveElementService(frameElement);
    }
};