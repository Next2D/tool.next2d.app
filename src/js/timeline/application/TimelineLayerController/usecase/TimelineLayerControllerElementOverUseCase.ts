import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerControllerActiveInsertIconElementService } from "../service/TimelineLayerControllerActiveInsertIconElementService";
import { execute as timelineLayerActiveMoveTargetStyleService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveMoveTargetStyleService";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤーコントローラーのヒット処理関数
 *              Hit processing function of the layer controller
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

    // 選択中の場合は処理をしない
    if (movieClip.selectedLayers.indexOf(layer) > -1) {
        return ;
    }

    // 移動先のレイヤーを未選択に更新
    timelineLayer.distIndex = layer_index;

    // styleを追加
    timelineLayerActiveMoveTargetStyleService(element);

    // 入れ子にできるタイプの場合はインサートアイコンを表示
    switch (layer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $MASK_IN_MODE: // マスクの子レイヤー
        case $GUIDE_MODE: // ガイドレイヤー
        case $GUIDE_IN_MODE: // ガイドの子レイヤー
            timelineLayerControllerActiveInsertIconElementService(element);
            break;

        default:
            break;

    }

};
