import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $GUIDE_IN_MODE, $MASK_IN_MODE } from "@/config/LayerModeConfig";
import { execute as timelineLayerControllerActiveExitIconElementService } from "../service/TimelineLayerControllerActiveExitIconElementService";

/**
 * @description Exitアイコンのマウスオーバー処理関数
 *              Mouse over processing function for the Exit icon
 *
 * @param  {HTMLElement} element
 * @param  {number} layer_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, layer_index: number): void =>
{
    if (!("name" in element.dataset)
        && element.dataset.name !== "exit-icon"
    ) {
        if (timelineLayer.exitMode) {
            const layerElement = timelineLayer.elements[timelineLayer.distIndex];
            if (layerElement) {
                timelineLayerControllerActiveExitIconElementService(layerElement);
            }

            // 選択情報をリセット
            timelineLayer.distIndex = -1;
            timelineLayer.exitMode  = false;
        }
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const layer = movieClip.getLayer(layer_index);
    if (!layer) {
        return ;
    }

    // 入れ子にできるタイプの場合はインサートアイコンを表示
    switch (layer.mode) {

        case $MASK_IN_MODE: // マスクの子レイヤー
        case $GUIDE_IN_MODE: // ガイドの子レイヤー

            // 子レイヤー解除のアイコンを表示
            element.style.opacity = "1";

            // 選択情報を設定
            timelineLayer.exitMode = true;

            // 移動先のレイヤーを未選択に更新
            timelineLayer.distIndex = layer_index;
            break;

        default:
            break;

    }
};