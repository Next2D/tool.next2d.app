import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerControllerActiveExitIconElementService } from "../service/TimelineLayerControllerActiveExitIconElementService";
import { execute as timelineLayerInactiveMoveTargetStyleService } from "@/timeline/application/TimelineLayer/service/TimelineLayerInactiveMoveTargetStyleService";

/**
 * @description Exitアイコンのマウスオーバー処理関数
 *              Mouse over processing function for the Exit icon
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを停止
    event.stopPropagation();

    // 処理済の場合はスキップ
    if (timelineLayer.distIndex === -1) {
        return ;
    }

    const exitElement: HTMLElement | null = event.target as HTMLElement;
    if (!exitElement) {
        return ;
    }

    const index = parseInt(exitElement.dataset.layerIndex as string);
    const parentElement = timelineLayer.elements[index];
    if (!parentElement) {
        return ;
    }

    // 選択を解除
    timelineLayer.distIndex = -1;

    // styleを初期化
    timelineLayerControllerActiveExitIconElementService(parentElement);

    // 表示を初期化
    timelineLayerInactiveMoveTargetStyleService(parentElement);
};