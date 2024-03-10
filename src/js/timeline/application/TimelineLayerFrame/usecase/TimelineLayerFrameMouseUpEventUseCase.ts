import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFrameMouseMoveEventUseCase } from "./TimelineLayerFrameMouseMoveEventUseCase";

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

    // マウスムーブイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        timelineLayerFrameMouseMoveEventUseCase
    );
};