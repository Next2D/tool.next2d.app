import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerElementDisplayNoneService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementUpdateDisplayService";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";

/**
 * @description 削除したレイヤーを元の配置に元に戻す
 *              Restore deleted layers to their original placement
 *
 * @param  {Layer}  layer
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, index: number): void =>
{
    // Layer Objectを内部情報に再登録
    const scene = $getCurrentWorkSpace().scene;
    scene.setLayer(layer, index);

    const element: HTMLElement | null = document.getElementById(`layer-id-${layer.id}`);
    if (!element) {
        return ;
    }

    // フレーム情報の表示を更新
    const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
    timelineLayerFrameUpdateStyleService(frameControllerElement, $getLeftFrame());

    // 対象のElementを表示にする
    timelineLayerElementDisplayNoneService(layer.id, "");
};