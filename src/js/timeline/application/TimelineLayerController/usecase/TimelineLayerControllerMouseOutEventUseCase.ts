import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getMoveLayerMode, $getTopIndex } from "../../TimelineUtil";
import { execute as timelineLayerControllerInactiveInsertIconElementService } from "../service/TimelineLayerControllerInactiveInsertIconElementService";
import { execute as timelineLayerControllerInactiveExitIconElementService } from "../service/TimelineLayerControllerInactiveExitIconElementService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤーコントローラーのマウスアウト処理関数
 *              Mouse out processing function for the layer controller
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
    if (!layer) {
        return ;
    }

    // 選択中の場合は処理をしない
    if (movieClip.selectedLayers.indexOf(layer) > -1) {
        return ;
    }

    // styleを追加
    if (parent.classList.contains("move-target")) {
        parent.classList.remove("move-target");
    }

    // 移動先のレイヤーを未選択に更新
    timelineLayer.distIndex = -1;

    // 入れ子にできるタイプの場合はインサートアイコンを非表示
    switch (layer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $GUIDE_MODE: // ガイドレイヤー
            timelineLayerControllerInactiveInsertIconElementService(parent);
            break;

        case $MASK_IN_MODE: // マスクの子レイヤー
        case $GUIDE_IN_MODE: // ガイドの子レイヤー
            timelineLayerControllerInactiveExitIconElementService(parent);
            timelineLayerControllerInactiveInsertIconElementService(parent);
            break;

        default:
            break;

    }
};
