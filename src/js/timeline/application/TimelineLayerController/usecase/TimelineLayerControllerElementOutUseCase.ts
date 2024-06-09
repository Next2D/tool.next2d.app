import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerControllerInactiveInsertIconElementService } from "../service/TimelineLayerControllerInactiveInsertIconElementService";
import { execute as timelineLayerControllerActiveExitIconElementService } from "../service/TimelineLayerControllerActiveExitIconElementService";
import { execute as timelineLayerInactiveMoveTargetStyleService } from "@/timeline/application/TimelineLayer/service/TimelineLayerInactiveMoveTargetStyleService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤーコントローラーのヒットアウト処理関数
 *              Layer controller hit out processing function
 *
 * @param  {HTMLElement} element
 * @param  {number} layer_index
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement, layer_index: number): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const layer = movieClip.getLayer(layer_index);
    if (!layer) {
        return ;
    }

    // styleを更新
    timelineLayerInactiveMoveTargetStyleService(element);

    // 移動先のレイヤーを未選択に更新
    timelineLayer.distIndex = -1;

    // 入れ子にできるタイプの場合はインサートアイコンを非表示
    switch (layer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $GUIDE_MODE: // ガイドレイヤー
            timelineLayerControllerInactiveInsertIconElementService(element);
            break;

        case $MASK_IN_MODE: // マスクの子レイヤー
        case $GUIDE_IN_MODE: // ガイドの子レイヤー
            if (timelineLayer.exitMode) {
                timelineLayer.exitMode = false;
                // styleだけ初期化
                timelineLayerControllerActiveExitIconElementService(element);
            }
            timelineLayerControllerInactiveInsertIconElementService(element);
            break;

        default:
            break;

    }
};
