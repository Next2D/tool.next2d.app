import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { $getTopIndex } from "../../TimelineUtil";
import { execute as timelineLayerActiveMoveTargetStyleService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveMoveTargetStyleService";

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

    const exitElement: HTMLElement | null = event.target as HTMLElement;
    if (!exitElement) {
        return ;
    }

    const index = parseInt(exitElement.dataset.layerIndex as string);
    const parentElement = timelineLayer.elements[index];
    if (!parentElement) {
        return ;
    }

    exitElement.style.opacity = "1";
    timelineLayer.distIndex = index + $getTopIndex();

    // styleを追加
    timelineLayerActiveMoveTargetStyleService(parentElement);
};