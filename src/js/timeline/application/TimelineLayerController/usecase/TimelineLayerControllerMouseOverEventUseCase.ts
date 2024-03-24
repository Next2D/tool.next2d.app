import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getMoveLayerMode, $getTopIndex } from "../../TimelineUtil";
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
 * @description レイヤーコントローラーのマウスオーバー処理関数
 *              Mouse over processing function for the layer controller
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 移動モードでない場合は処理をしない
    if (!$getMoveLayerMode()) {
        return ;
    }

    // 親のイベントを停止
    event.stopPropagation();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const parent = element.parentElement as HTMLElement;
    if (!parent) {
        return ;
    }

    const layerIndex = parseInt(parent.dataset.layerIndex as string) + $getTopIndex();
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const layer = movieClip.layers[layerIndex];

    // 選択中の場合は処理をしない
    if (movieClip.selectedLayers.indexOf(layer) > -1) {
        return ;
    }

    // 移動先のレイヤーを未選択に更新
    timelineLayer.distIndex = parseInt(parent.dataset.layerIndex as string) + $getTopIndex();

    // styleを追加
    timelineLayerActiveMoveTargetStyleService(parent);

    // 入れ子にできるタイプの場合はインサートアイコンを表示
    switch (layer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $MASK_IN_MODE: // マスクの子レイヤー
        case $GUIDE_MODE: // ガイドレイヤー
        case $GUIDE_IN_MODE: // ガイドの子レイヤー
            timelineLayerControllerActiveInsertIconElementService(parent);
            break;

        default:
            break;

    }

};
