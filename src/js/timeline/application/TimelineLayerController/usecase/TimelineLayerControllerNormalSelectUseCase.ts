import { execute as timelineLayerFrameClearSelectedElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameClearSelectedElementService";
import { timelineFrame } from "@/timeline/domain/model/TimelineFrame";
import { $getLeftFrame } from "../../TimelineUtil";
import { execute as timelineLayerFrameActiveElementService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameActiveElementService";

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
    const element: HTMLElement | null = document
        .getElementById(`timeline-frame-controller-${layer_id}`);

    if (!element) {
        return ;
    }

    // 現在のフレーム番号から対象のフレームElementを取得
    const index = timelineFrame.currentFrame - $getLeftFrame();

    const frameElement: HTMLElement | null = element.children[index] as HTMLElement;
    if (!frameElement) {
        return ;
    }

    // 選択中のフレームElementを非アクティブにする
    timelineLayerFrameClearSelectedElementService();

    // 対象のフレームElementをアクティブ表示にする
    timelineLayerFrameActiveElementService(frameElement);
};