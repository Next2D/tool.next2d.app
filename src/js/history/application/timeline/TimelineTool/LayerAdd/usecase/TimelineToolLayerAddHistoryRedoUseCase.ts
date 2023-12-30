import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { $getLeftFrame, $getTopIndex } from "@/timeline/application/TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @param  {Layer}  layer
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, index: number): void =>
{
    // Layer Objectを内部情報から削除
    const scene = $getCurrentWorkSpace().scene;
    scene.setLayer(layer, index);

    // 表示領域にあれば表示
    const workSpace = $getCurrentWorkSpace();
    if (index >= $getTopIndex()
        && (index + 1) * workSpace.timelineAreaState.frameHeight <= timelineLayer.clientHeight
    ) {

        const element: HTMLElement | null = document
            .getElementById(`layer-id-${layer.id}`);

        if (!element) {
            return ;
        }

        // フレーム情報の表示を更新
        const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
        timelineLayerFrameUpdateStyleService(frameControllerElement, $getLeftFrame());

        layer.display = element.style.display = "";
    }

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();
};