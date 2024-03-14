import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFrameWindowMouseMoveEventUseCase } from "./TimelineLayerFrameWindowMouseMoveEventUseCase";

/**
 * @description フレームエリアのマウスダウンの実行関数
 *              Execution function of mouse down in frame area
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

    // windowのムーブイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        timelineLayerFrameWindowMouseMoveEventUseCase
    );
};