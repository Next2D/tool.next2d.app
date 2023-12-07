import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";

/**
 * @description レイヤーのコントローラーエリアのマウスダウン処理関数
 *              Mouse down processing function for the controller area of a layer
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    element.classList.add("active");

    // フレーム情報を更新してマーカーを移動
    const frameElement: HTMLElement | null = event.target as HTMLElement;
    const frame = parseInt(frameElement.dataset.frame as string);

    // フレーム情報を更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();
};