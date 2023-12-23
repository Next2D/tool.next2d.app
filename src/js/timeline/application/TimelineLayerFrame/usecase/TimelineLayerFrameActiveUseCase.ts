import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";

/**
 * @description 選択したフレーム情報を表示する
 *              Display selected frame information
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // フレーム情報を更新してマーカーを移動
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const frame: number = parseInt(element.dataset.frame as string);

    // フレーム情報を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();
};