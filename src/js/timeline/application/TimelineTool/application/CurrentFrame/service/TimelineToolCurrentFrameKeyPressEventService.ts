import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";

/**
 * @description タイムラインのフレームInput Elementのキープレスイベント処理関数
 *              Keypress event processing function for the frame Input Element of the timeline
 *
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
{
    if (event.key !== "Enter") {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    const frame = parseInt(element.value);

    // フレームを更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();

    // 入力終了
    element.blur();
};