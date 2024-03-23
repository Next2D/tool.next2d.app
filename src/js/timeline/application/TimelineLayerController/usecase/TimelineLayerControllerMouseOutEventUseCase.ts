import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getMoveLayerMode, $getTopIndex } from "../../TimelineUtil";
import { execute as timelineLayerControllerInactiveInsertIconElementService } from "../service/TimelineLayerControllerInactiveInsertIconElementService";
import { execute as timelineLayerControllerInactiveExitIconElementService } from "../service/TimelineLayerControllerInactiveExitIconElementService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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

        case 1: // マスクレイヤー
        case 3: // ガイドレイヤー
            timelineLayerControllerInactiveInsertIconElementService(parent);
            break;

        case 2: // マスクの子レイヤー
        case 4: // ガイドの子レイヤー
            timelineLayerControllerInactiveExitIconElementService(parent);
            timelineLayerControllerInactiveInsertIconElementService(parent);
            break;

        default:
            break;

    }
};
