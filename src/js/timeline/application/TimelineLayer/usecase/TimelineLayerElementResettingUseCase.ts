import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerControllerInactiveInsertIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerInactiveInsertIconElementService";
import { execute as timelineLayerControllerInactiveExitIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerInactiveExitIconElementService";
import { execute as timelineLayerInactiveMoveTargetStyleService } from "../service/TimelineLayerInactiveMoveTargetStyleService";

/**
 * @description タイムラインの全てのレイヤースタイルから"move-target"を削除する
 *              Remove "move-target" from all layer styles in the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    // 選択表示のborderを削除
    timelineLayerInactiveMoveTargetStyleService(element);

    // インサートアイコンを非表示
    timelineLayerControllerInactiveInsertIconElementService(element);

    // イグジットアイコンを非表示
    timelineLayerControllerInactiveExitIconElementService(element);
};