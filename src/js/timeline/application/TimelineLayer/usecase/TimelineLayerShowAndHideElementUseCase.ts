import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLeftFrame, $getTopIndex } from "../../TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineLayerControllerUpdateElementStyleUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerUpdateElementStyleUseCase";

/**
 * @description 表示領域にあるレイヤーで、非表示になってるレイヤーを再描画
 *              Redraw hidden layers in the visible area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();

    const layers = workSpace.scene.layers;
    if (!layers.length) {
        return ;
    }

    const topIndex: number    = $getTopIndex();
    const leftFrame: number   = $getLeftFrame();
    const frameHeight: number = workSpace.timelineAreaState.frameHeight;
    let currentHeight: number = 0;

    const length: number = timelineLayer.elements.length;
    for (let idx: number = 0; length > idx; ++idx) {

        const layerElement = timelineLayer.elements[idx] as NonNullable<HTMLElement>;

        const index: number = topIndex + idx;

        // Layerオブジェクトがない時は非表示にして終了
        if (index >= layers.length) {
            layerElement.style.display = "none";
            continue;
        }

        const layer = layers[index];

        // 表示領域外にあれば非表示にして終了
        if (currentHeight > timelineLayer.clientHeight) {
            if (layer.display === "") {
                layer.display = layerElement.style.display = "none";
            }
            continue;
        }

        // fixed logic
        if (idx >= topIndex) {
            currentHeight += frameHeight;
        }

        // 既に表示されていればスキップ
        if (layer.display === "") {
            continue;
        }

        // 表示領域内にあれば表示
        layer.display = layerElement.style.display = "";

        // スクロール位置に合わせてフレームElementのStyleを更新
        const frameControllerElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
        timelineLayerFrameUpdateStyleService(frameControllerElement, leftFrame);

        // Layerの状態に合わせて表示情報を更新
        timelineLayerControllerUpdateElementStyleUseCase(layer);
    }
};